/**
 * Example: How to use the SofaScore mapper
 *
 * This file demonstrates how to convert SofaScore API data
 * to the format used by FlexibleSingleEliminationBracket
 */

import {
  mapSofaScoreToMatches,
  mapSofaScoreToMatchesPreserveIds,
  FlexibleSingleEliminationBracket,
  Match,
  SofaScoreData,
} from 'react-tournament-brackets';

// Example 1: Basic usage with SofaScore API data
async function fetchAndDisplayBracket() {
  // Fetch data from SofaScore API
  const response = await fetch(
    'https://api.sofascore.com/api/v1/unique-tournament/7/season/41897/cup-trees'
  );
  const sofaScoreData: SofaScoreData = await response.json();

  // Convert to bracket format
  const matches = mapSofaScoreToMatches(sofaScoreData);

  // Render the bracket
  return (
    <FlexibleSingleEliminationBracket
      matches={matches}
      matchComponent={Match}
    />
  );
}

// Example 2: With visible bye indicators per match
function BracketWithVisibleByes() {
  // Your SofaScore data
  const sofaScoreData: SofaScoreData = {
    cupTrees: [
      // ... your tournament data
    ],
  };

  // Convert to matches
  const matches = mapSofaScoreToMatches(sofaScoreData);

  // Optionally add byeRenderMode to specific matches
  const matchesWithByes = matches.map(match => {
    if (match.participants.length === 1) {
      return { ...match, byeRenderMode: 'show-with-indicator' };
    }
    return match;
  });

  return (
    <FlexibleSingleEliminationBracket
      matches={matchesWithByes}
      matchComponent={Match}
    />
  );
}

// Example 3: Preserving SofaScore IDs for reference
function BracketWithPreservedIds() {
  const sofaScoreData: SofaScoreData = {
    cupTrees: [
      /* ... */
    ],
  };

  // Convert while preserving original block IDs
  const matches = mapSofaScoreToMatchesPreserveIds(sofaScoreData);

  // Now you can use the original SofaScore block IDs
  // for cross-referencing or API calls
  const matchId = matches[0].id; // This is the original SofaScore block ID

  return (
    <FlexibleSingleEliminationBracket
      matches={matches}
      matchComponent={Match}
    />
  );
}

// Example 4: Processing multiple tournaments
function MultipleTournaments() {
  const tournaments = [
    { id: 'ucl-2022', data: sofaScoreData1 },
    { id: 'europa-2022', data: sofaScoreData2 },
  ];

  return (
    <div>
      {tournaments.map(tournament => {
        const matches = mapSofaScoreToMatches(tournament.data);
        return (
          <div key={tournament.id}>
            <h2>{tournament.id}</h2>
            <FlexibleSingleEliminationBracket
              matches={matches}
              matchComponent={Match}
            />
          </div>
        );
      })}
    </div>
  );
}

// Example 5: Adding custom data transformation
function BracketWithCustomTransform() {
  const sofaScoreData: SofaScoreData = {
    cupTrees: [
      /* ... */
    ],
  };

  // Get the basic matches
  const matches = mapSofaScoreToMatches(sofaScoreData);

  // Add custom properties or transformations
  const enhancedMatches = matches.map(match => ({
    ...match,
    // Add custom match name based on round
    name:
      match.tournamentRoundText === '1'
        ? 'Final'
        : match.tournamentRoundText === '2'
        ? `Semi-Final ${match.id}`
        : `Round ${match.tournamentRoundText}`,
    // Add custom participant data
    participants: match.participants.map(p => ({
      ...p,
      // You could add logos, colors, etc. here
    })),
  }));

  return (
    <FlexibleSingleEliminationBracket
      matches={enhancedMatches}
      matchComponent={Match}
    />
  );
}

export {
  fetchAndDisplayBracket,
  BracketWithVisibleByes,
  BracketWithPreservedIds,
  MultipleTournaments,
  BracketWithCustomTransform,
};
