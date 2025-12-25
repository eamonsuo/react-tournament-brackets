import { Match, Participant } from '../types';

/**
 * Type definitions for SofaScore API data structure
 */
interface SofaScoreTeam {
  name: string;
  slug: string;
  shortName: string;
  id: number;
  nameCode: string;
  teamColors?: {
    primary: string;
    secondary: string;
    text: string;
  };
  [key: string]: any;
}

interface SofaScoreParticipant {
  team: SofaScoreTeam;
  winner: boolean;
  sourceBlockId?: number;
  order: number;
  id: number;
}

interface SofaScoreBlock {
  finished: boolean;
  matchesInRound: number;
  order: number;
  result: string;
  homeTeamScore?: string;
  awayTeamScore?: string;
  participants: SofaScoreParticipant[];
  hasNextRoundLink: boolean;
  id: number;
  events?: number[];
  blockId: number;
  seriesStartDateTimestamp?: number;
  automaticProgression: boolean;
  eventInProgress?: boolean;
}

interface SofaScoreRound {
  order: number;
  type: number;
  description: string;
  blocks: SofaScoreBlock[];
  id: number;
}

interface SofaScoreCupTree {
  id: number;
  name: string;
  currentRound: number;
  rounds: SofaScoreRound[];
  type: number;
  showSingleParticipantByeBlocks: boolean;
  hideRoundsWithoutParticipants: boolean;
  [key: string]: any;
}

export interface SofaScoreData {
  cupTrees: SofaScoreCupTree[];
}

/**
 * Map SofaScore participant to our Participant type
 */
function mapParticipant(
  sofaParticipant: SofaScoreParticipant,
  matchFinished: boolean
): Participant {
  const participant: Participant = {
    id: sofaParticipant.team.id.toString(),
    name: sofaParticipant.team.name,
    isWinner: sofaParticipant.winner,
  };

  // Add status based on match state
  if (matchFinished) {
    participant.status = sofaParticipant.winner ? 'PLAYED' : 'PLAYED';
  }

  return participant;
}

/**
 * Get match state based on SofaScore block data
 */
function getMatchState(block: SofaScoreBlock): string {
  if (block.finished) {
    return 'SCORE_DONE';
  }
  if (block.eventInProgress) {
    return 'RUNNING';
  }
  return 'SCHEDULED';
}

/**
 * Converts SofaScore tournament data to Match[] format for FlexibleSingleEliminationBracket
 *
 * @param sofaScoreData - The SofaScore API response data
 * @returns Array of Match objects compatible with FlexibleSingleEliminationBracket
 */
export function mapSofaScoreToMatches(sofaScoreData: SofaScoreData): Match[] {
  const matches: Match[] = [];

  // Get the first cup tree (typically there's only one)
  const cupTree = sofaScoreData.cupTrees[0];
  if (!cupTree || !cupTree.rounds || cupTree.rounds.length === 0) {
    return matches;
  }

  // Create a map to track block IDs to match IDs
  // blockId -> matchId
  const blockToMatchIdMap = new Map<number, number>();

  // Create a map to track which blocks feed into which blocks in the next round
  // currentBlockId -> nextMatchId
  const nextMatchMap = new Map<number, number | null>();

  // First pass: Create all matches and build the blockId -> matchId mapping
  let matchIdCounter = 1;

  // Process rounds in reverse order (from final to first round)
  const reversedRounds = [...cupTree.rounds].reverse();

  reversedRounds.forEach((round, roundIndex) => {
    const roundNumber = cupTree.rounds.length - roundIndex;

    round.blocks.forEach(block => {
      const matchId = matchIdCounter++;
      blockToMatchIdMap.set(block.blockId, matchId);

      // Determine if this block has a next round
      if (block.hasNextRoundLink) {
        // We'll set the actual nextMatchId in the second pass
        nextMatchMap.set(block.blockId, -1); // Placeholder
      } else {
        // This is the final match
        nextMatchMap.set(block.blockId, null);
      }
    });
  });

  // Second pass: Build the nextMatchId relationships
  reversedRounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) {
      // This is the final round, no next matches
      return;
    }

    const nextRound = reversedRounds[roundIndex - 1];

    round.blocks.forEach(block => {
      if (!block.hasNextRoundLink) {
        return;
      }

      // Find which block in the next round this block feeds into
      // by looking for participants with sourceBlockId matching this block's blockId
      let foundNextBlock = false;

      for (const nextBlock of nextRound.blocks) {
        const hasParticipantFromThisBlock = nextBlock.participants.some(
          p => p.sourceBlockId === block.blockId
        );

        if (hasParticipantFromThisBlock) {
          const nextMatchId = blockToMatchIdMap.get(nextBlock.blockId);
          if (nextMatchId) {
            nextMatchMap.set(block.blockId, nextMatchId);
            foundNextBlock = true;
            break;
          }
        }
      }

      // If we didn't find a next block but hasNextRoundLink is true,
      // this might be a data inconsistency - set to null
      if (!foundNextBlock) {
        console.warn(
          `Block ${block.blockId} has hasNextRoundLink=true but no matching next block found`
        );
        nextMatchMap.set(block.blockId, null);
      }
    });
  });

  // Third pass: Create the actual Match objects
  matchIdCounter = 1;

  reversedRounds.forEach((round, roundIndex) => {
    const roundNumber = cupTree.rounds.length - roundIndex;

    round.blocks.forEach(block => {
      const matchId = matchIdCounter++;
      const nextMatchId = nextMatchMap.get(block.blockId) ?? null;

      // Map participants
      const participants = block.participants.map(p =>
        mapParticipant(p, block.finished)
      );

      // Convert timestamp to ISO date string
      let startTime: string | undefined;
      if (block.seriesStartDateTimestamp) {
        startTime = new Date(
          block.seriesStartDateTimestamp * 1000
        ).toISOString();
      }

      const match: Match = {
        id: matchId,
        name: `${round.description} - Match ${block.order}`,
        nextMatchId: nextMatchId === -1 ? null : nextMatchId,
        tournamentRoundText: roundNumber.toString(),
        startTime,
        state: getMatchState(block),
        participants,
      };

      matches.push(match);
    });
  });

  console.log(matches);
  return matches;
}

/**
 * Alternative mapper that preserves SofaScore block IDs as match IDs
 * This can be useful if you need to maintain the original IDs for reference
 *
 * @param sofaScoreData - The SofaScore API response data
 * @returns Array of Match objects with SofaScore block IDs preserved
 */
export function mapSofaScoreToMatchesPreserveIds(
  sofaScoreData: SofaScoreData
): Match[] {
  const matches: Match[] = [];

  const cupTree = sofaScoreData.cupTrees[0];
  if (!cupTree) {
    return matches;
  }

  // Create a map to track which blocks feed into which blocks
  const nextMatchMap = new Map<number, number | null>();

  // First pass: Build the nextMatchId relationships
  const reversedRounds = [...cupTree.rounds].reverse();

  reversedRounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) {
      // This is the final round
      round.blocks.forEach(block => {
        nextMatchMap.set(block.blockId, null);
      });
      return;
    }

    const nextRound = reversedRounds[roundIndex - 1];

    round.blocks.forEach(block => {
      if (!block.hasNextRoundLink) {
        nextMatchMap.set(block.blockId, null);
        return;
      }

      // Find which block in the next round this block feeds into
      for (const nextBlock of nextRound.blocks) {
        const hasParticipantFromThisBlock = nextBlock.participants.some(
          p => p.sourceBlockId === block.blockId
        );

        if (hasParticipantFromThisBlock) {
          nextMatchMap.set(block.blockId, nextBlock.blockId);
          break;
        }
      }

      // If no next block found, set to null
      if (!nextMatchMap.has(block.blockId)) {
        nextMatchMap.set(block.blockId, null);
      }
    });
  });

  // Second pass: Create Match objects using block IDs
  reversedRounds.forEach((round, roundIndex) => {
    const roundNumber = cupTree.rounds.length - roundIndex;

    round.blocks.forEach(block => {
      const nextMatchId = nextMatchMap.get(block.blockId) ?? null;

      const participants = block.participants.map(p =>
        mapParticipant(p, block.finished)
      );

      let startTime: string | undefined;
      if (block.seriesStartDateTimestamp) {
        startTime = new Date(
          block.seriesStartDateTimestamp * 1000
        ).toISOString();
      }

      const match: Match = {
        id: block.blockId,
        name: `${round.description} - Match ${block.order}`,
        nextMatchId,
        tournamentRoundText: roundNumber.toString(),
        startTime,
        state: getMatchState(block),
        participants,
      };

      matches.push(match);
    });
  });

  return matches;
}
