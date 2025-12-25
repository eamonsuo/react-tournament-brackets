# FlexibleSingleEliminationBracket

## Overview

`FlexibleSingleEliminationBracket` is an enhanced version of the standard `SingleEliminationBracket` that supports **dynamic match counts per round**. This allows tournaments where teams can start at different rounds without requiring excessive bye matches.

## Key Features

- ✅ **Variable matches per round** - No longer requires complete binary tree structure
- ✅ **Smart bye handling** - Skip or show bye matches with indicators
- ✅ **Per-match customization** - Override bye rendering mode on individual matches
- ✅ **Flexible connectors** - Automatically handles 0, 1, or 2 previous matches
- ✅ **Backward compatible** - Works with existing match data format
- ✅ **Team placement flexibility** - Teams can start in any round (e.g., top seeds skip early rounds)

## When to Use

### Use `FlexibleSingleEliminationBracket` when:

- You have an odd number of teams (5, 6, 7, etc.)
- Top-seeded teams should skip early rounds
- You want to minimize empty/bye matches
- Different teams start at different points in the bracket

### Use `SingleEliminationBracket` when:

- You have a power-of-2 number of teams (4, 8, 16, 32, etc.)
- All teams start in the first round
- Traditional bracket visualization is required

## Installation & Usage

```tsx
import { FlexibleSingleEliminationBracket } from 'react-tournament-brackets';

function MyBracket() {
  return (
    <FlexibleSingleEliminationBracket
      matches={myMatches}
      matchComponent={Match}
    />
  );
}
```

## Props

All props from `SingleEliminationBracket`.

### Per-Match Control: `match.byeRenderMode`

You can control bye rendering for individual matches:

```typescript
{
  id: 1,
  name: 'Quarter-Final 1',
  nextMatchId: 2,
  tournamentRoundText: '1',
  startTime: '2025-12-26',
  state: 'WALK_OVER',
  byeRenderMode: 'show-with-indicator',
  participants: [
    { id: 'team1', name: 'Team 1', isWinner: true }
  ]
}
```

## Data Structure

The component automatically detects:

1. **Starting matches**: Matches with no previous matches feeding into them
2. **Bye matches**: Matches with only 1 participant
3. **Round structure**: Works backwards from the final match

### Example: 5-Team Bracket

```typescript
const fiveTeamBracket = [
  // Final
  { id: 1, name: 'Final', nextMatchId: null, ... },

  // Semi-finals (Team 3 gets a bye - starts here)
  { id: 2, name: 'Semi 1', nextMatchId: 1, participants: [{ id: 'team3', ... }] },
  { id: 3, name: 'Semi 2', nextMatchId: 1, participants: [team4, team5] },

  // Quarter-final (only 1 match)
  { id: 4, name: 'Quarter', nextMatchId: 2, participants: [team1, team2] },
];
```

**Visual Result:**

```
Round 1        Round 2         Round 3
─────────      ─────────       ─────────
Team 1  ───┐
           ├── Semi 1  ───┐
Team 2  ───┘              │
                          ├── Final
Team 3  ──────────────┐   │
                      │   │
Team 4  ───┐          │   │
           ├── Semi 2 ────┘
Team 5  ───┘
```

## Examples

### 1. Skip Byes (Compact View)

```tsx
<FlexibleSingleEliminationBracket
  matches={sixTeamBracket}
  matchComponent={Match}
/>
```

### 2. Show Specific Byes

```tsx
const matches = [
  {
    id: 1,
    byeRenderMode: 'show-with-indicator', // Show this bye
    participants: [{ id: 'seed1', name: 'Top Seed' }],
    ...
  },
];

<FlexibleSingleEliminationBracket
  matches={matches}
  matchComponent={Match}
/>
```

## How It Works

### 1. Column Generation

Unlike the standard bracket which requires exactly 2 matches per next match, the flexible bracket:

- Works backwards from the final match
- Collects 0, 1, or 2 previous matches for each match
- Filters out bye matches based on render mode

### 2. Positioning Algorithm

Instead of exponential spacing (`2^n`), the flexible algorithm:

- Aligns matches with where their output goes
- Centers matches vertically with their destination
- Spaces sibling matches evenly above/below the next match

### 3. Connector Logic

Smart connectors adapt based on previous match count:

- **0 previous matches**: No connector lines
- **1 previous match**: Single line from center to center
- **2 previous matches**: Standard dual connectors

## Migration from SingleEliminationBracket

Simple! Just change the import:

```diff
- import { SingleEliminationBracket } from 'react-tournament-brackets';
+ import { FlexibleSingleEliminationBracket } from 'react-tournament-brackets';

- <SingleEliminationBracket
+ <FlexibleSingleEliminationBracket
    matches={matches}
    matchComponent={Match}
  />
```

Your existing match data works as-is!

## Test Data

Several example datasets are available in `src/mock-data/flexible-bracket-data.ts`:

- `fiveTeamBracket` - 5 teams with dynamic rounds
- `sixTeamBracketWithSkippedByes` - 6 teams, byes hidden
- `sixTeamBracketWithVisibleByes` - 6 teams, byes shown
- `mixedModeBracket` - Per-match bye rendering
- `irregularBracket` - Teams starting at different rounds

## TypeScript

Full TypeScript support with updated types:

```typescript
import {
  FlexibleSingleElimLeaderboardProps,
  Match
} from 'react-tournament-brackets';

// Match now has optional byeRenderMode
const match: Match = {
  id: 1,
  byeRenderMode: 'show-with-indicator', // Optional
  ...
};
```

## Storybook

View interactive examples:

```bash
npm run storybook
```

Navigate to **Components > FlexibleBracket** to see:

- 5-Team Bracket
- 6-Team Bracket (Byes Hidden)
- 6-Team Bracket (Byes Visible)
- Mixed Bye Rendering
- Irregular Bracket
- Custom Theme Example

## Limitations

- Only supports **single elimination** (not double elimination yet)
- Maximum 2 matches can feed into any single match (standard single-elim constraint)
- Match positioning is optimized for vertical alignment, may need adjustment for very irregular brackets

## Future Enhancements

Potential additions:

- Double elimination support
- Custom bye rendering components
- Advanced seeding algorithms
- Automatic bracket balancing

## Credits

Built on top of the excellent [react-tournament-brackets](https://github.com/g-loot/react-tournament-brackets) library by G-Loot.
