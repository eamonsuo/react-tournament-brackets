import { Match } from '../types';
import { mapSofaScoreToMatches } from '../utils/sofascore-mapper';
import { sofascoredata } from './flexible-bracket-data';

/**
 * Pre-mapped SofaScore data - UEFA Champions League 2021-22 Knockout Stage
 * Separated into its own file to avoid potential circular dependency issues
 */
export const sofascoreMappedBracket: Match[] = [
  {
    id: 1,
    name: 'Final - Match 1',
    nextMatchId: null,
    tournamentRoundText: '4',
    startTime: '2022-05-28T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '44',
        name: 'Liverpool',
        isWinner: false,
        status: 'PLAYED',
        resultText: '',
      },
      {
        id: '2829',
        name: 'Real Madrid',
        isWinner: true,
        status: 'PLAYED',
        resultText: '',
      },
    ],
  },
  {
    id: 2,
    name: 'Semifinals - Match 1',
    nextMatchId: 1,
    tournamentRoundText: '3',
    startTime: '2022-04-27T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '44',
        name: 'Liverpool',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '2819',
        name: 'Villarreal',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 3,
    name: 'Semifinals - Match 2',
    nextMatchId: 1,
    tournamentRoundText: '3',
    startTime: '2022-04-26T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '17',
        name: 'Manchester City',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '2829',
        name: 'Real Madrid',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 4,
    name: 'Quarterfinals - Match 1',
    nextMatchId: 2,
    tournamentRoundText: '2',
    startTime: '2022-04-05T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '3006',
        name: 'Benfica',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '44',
        name: 'Liverpool',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 5,
    name: 'Quarterfinals - Match 2',
    nextMatchId: 2,
    tournamentRoundText: '2',
    startTime: '2022-04-06T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2819',
        name: 'Villarreal',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '2672',
        name: 'FC Bayern München',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 6,
    name: 'Quarterfinals - Match 3',
    nextMatchId: 3,
    tournamentRoundText: '2',
    startTime: '2022-04-05T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '17',
        name: 'Manchester City',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '2836',
        name: 'Atlético Madrid',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 7,
    name: 'Quarterfinals - Match 4',
    nextMatchId: 3,
    tournamentRoundText: '2',
    startTime: '2022-04-06T19:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '38',
        name: 'Chelsea',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '2829',
        name: 'Real Madrid',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 8,
    name: '1/8 - Match 1',
    nextMatchId: 4,
    tournamentRoundText: '1',
    startTime: '2022-02-23T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '3006',
        name: 'Benfica',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '2953',
        name: 'AFC Ajax',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 9,
    name: '1/8 - Match 2',
    nextMatchId: 4,
    tournamentRoundText: '1',
    startTime: '2022-02-16T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2697',
        name: 'Inter',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '44',
        name: 'Liverpool',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 10,
    name: '1/8 - Match 3',
    nextMatchId: 5,
    tournamentRoundText: '1',
    startTime: '2022-02-22T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2819',
        name: 'Villarreal',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '2687',
        name: 'Juventus',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 11,
    name: '1/8 - Match 4',
    nextMatchId: 5,
    tournamentRoundText: '1',
    startTime: '2022-02-16T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2046',
        name: 'Red Bull Salzburg',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '2672',
        name: 'FC Bayern München',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 12,
    name: '1/8 - Match 5',
    nextMatchId: 6,
    tournamentRoundText: '1',
    startTime: '2022-02-15T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '17',
        name: 'Manchester City',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '3001',
        name: 'Sporting CP',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 13,
    name: '1/8 - Match 6',
    nextMatchId: 6,
    tournamentRoundText: '1',
    startTime: '2022-02-23T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2836',
        name: 'Atlético Madrid',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '35',
        name: 'Manchester United',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 14,
    name: '1/8 - Match 7',
    nextMatchId: 7,
    tournamentRoundText: '1',
    startTime: '2022-02-22T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '38',
        name: 'Chelsea',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '1643',
        name: 'Lille',
        isWinner: false,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 15,
    name: '1/8 - Match 8',
    nextMatchId: 7,
    tournamentRoundText: '1',
    startTime: '2022-02-15T20:00:00.000Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '1644',
        name: 'Paris Saint-Germain',
        isWinner: false,
        status: 'PLAYED',
      },
      {
        id: '2829',
        name: 'Real Madrid',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
];
