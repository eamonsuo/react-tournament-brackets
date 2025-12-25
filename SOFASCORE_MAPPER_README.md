# SofaScore Data Mapper

This utility provides functions to convert [SofaScore API](https://www.sofascore.com/) tournament data into the format used by the `FlexibleSingleEliminationBracket` component.

## Overview

SofaScore uses a different data structure than our bracket components:

- **SofaScore**: Uses `blocks` with `hasNextRoundLink` boolean and `sourceBlockId` to track progression
- **Our Format**: Uses `Match` objects with `nextMatchId` to create a linked structure

The mapper handles this conversion automatically, including:

- ✅ Converting blocks to matches
- ✅ Building the `nextMatchId` chain by analyzing `sourceBlockId` references
- ✅ Mapping team data to participants
- ✅ Converting match states (finished, in progress, scheduled)
- ✅ Handling bye matches (single participant)
- ✅ Converting timestamps to ISO date strings

## Usage

### Basic Usage

```typescript
import {
  mapSofaScoreToMatches,
  SofaScoreData,
} from 'react-tournament-brackets';

// Your SofaScore API response
const sofaScoreData: SofaScoreData = {
  cupTrees: [
    {
      rounds: [
        // ... round data
      ],
    },
  ],
};

// Convert to bracket format
const matches = mapSofaScoreToMatches(sofaScoreData);

// Use with FlexibleSingleEliminationBracket
<FlexibleSingleEliminationBracket matches={matches} matchComponent={Match} />;
```

### Preserving SofaScore IDs

If you need to maintain the original SofaScore block IDs (e.g., for cross-referencing or API calls):

```typescript
import { mapSofaScoreToMatchesPreserveIds } from 'react-tournament-brackets';

const matches = mapSofaScoreToMatchesPreserveIds(sofaScoreData);
// Match IDs will be the same as SofaScore block IDs
```

## API Reference

### `mapSofaScoreToMatches(data)`

Converts SofaScore data to Match array with sequential IDs.

**Parameters:**

- `data: SofaScoreData` - The SofaScore API response

**Returns:** `Match[]` - Array of matches compatible with FlexibleSingleEliminationBracket

### `mapSofaScoreToMatchesPreserveIds(data)`

Same as above, but preserves SofaScore block IDs as match IDs.

## Data Structure Mapping

### SofaScore Block → Match

| SofaScore Field                      | Our Match Field       | Transformation                      |
| ------------------------------------ | --------------------- | ----------------------------------- |
| `blockId`                            | `id`                  | Direct mapping or sequential        |
| `hasNextRoundLink` + `sourceBlockId` | `nextMatchId`         | Analyzed to build chain             |
| `description` + `order`              | `name`                | Combined as "Description - Match X" |
| Round order                          | `tournamentRoundText` | Converted to string                 |
| `seriesStartDateTimestamp`           | `startTime`           | Unix timestamp → ISO string         |
| `finished` / `eventInProgress`       | `state`               | Mapped to our state enum            |
| `participants`                       | `participants`        | Array mapping (see below)           |

### SofaScore Participant → Participant

| SofaScore Field           | Our Participant Field |
| ------------------------- | --------------------- |
| `team.id`                 | `id` (as string)      |
| `team.name`               | `name`                |
| `winner`                  | `isWinner`            |
| (derived from `finished`) | `status`              |

## Example: UEFA Champions League

The repository includes a complete example using UEFA Champions League 2021-22 knockout stage data:

```typescript
import { sofascoreMappedBracket } from './mock-data/flexible-bracket-data';

// This bracket includes:
// - Round of 16 (8 matches)
// - Quarter-finals (4 matches)
// - Semi-finals (2 matches)
// - Final (1 match)
```

View this example in Storybook: **SofaScore Data (UEFA Champions League 2021-22)**

## How the Mapper Works

1. **First Pass**: Creates a `blockId → matchId` mapping for all blocks
2. **Second Pass**: Analyzes `sourceBlockId` references to determine `nextMatchId` relationships
3. **Third Pass**: Creates Match objects with all mapped data

This three-pass approach ensures all relationships are correctly established even in complex tournament structures.

## Limitations

- Currently only supports single-elimination tournaments
- Assumes one cup tree per response (uses first tree)
- Does not preserve all SofaScore metadata (focuses on bracket essentials)
- Best-of-X series are represented as single matches with aggregate scores

## TypeScript Support

Full TypeScript definitions are included:

```typescript
export interface SofaScoreData {
  cupTrees: SofaScoreCupTree[];
}

// Import types as needed
import type { SofaScoreData } from 'react-tournament-brackets';
```

## Testing

Run Storybook to see the mapped data in action:

```bash
npm run storybook
```

Navigate to **Components/FlexibleBracket → SofaScore Data** to see the live example.
