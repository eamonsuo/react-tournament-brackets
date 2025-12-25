# SofaScore to FlexibleBracket Mapper - Implementation Summary

## Overview

I've created a complete mapping solution to convert SofaScore API tournament data into the format used by the `FlexibleSingleEliminationBracket` component.

## Files Created

### 1. **src/utils/sofascore-mapper.ts** (Main Mapper)

The core mapping logic with two main functions:

#### `mapSofaScoreToMatches(data)`

- Converts SofaScore data to Match array with sequential IDs (1, 2, 3, ...)
- Analyzes `hasNextRoundLink` and `sourceBlockId` to build the `nextMatchId` chain
- Three-pass algorithm ensures all relationships are correctly established

#### `mapSofaScoreToMatchesPreserveIds(data)`

- Same functionality but preserves original SofaScore block IDs
- Useful when you need to cross-reference with SofaScore API

**Key Features:**

- ✅ Automatically builds `nextMatchId` chain from `sourceBlockId` references
- ✅ Maps team data to participants
- ✅ Converts match states (SCORE_DONE, RUNNING, SCHEDULED)
- ✅ Handles bye matches (single participant)
- ✅ Converts Unix timestamps to ISO strings

### 2. **src/utils/sofascore-mapper.spec.ts** (Tests)

Comprehensive test suite covering:

- Basic conversion functionality
- nextMatchId chain validation
- Team data mapping
- Match state conversion
- ID preservation
- Edge cases (empty data, missing timestamps)

### 3. **SOFASCORE_MAPPER_README.md** (Documentation)

Complete usage guide including:

- Quick start examples
- API reference
- Data structure mapping table
- TypeScript type definitions
- How the mapper works (3-pass algorithm)
- Limitations and considerations

### 4. **examples/sofascore-mapper-usage.tsx** (Usage Examples)

Real-world usage examples:

- Basic API fetch and display
- Custom bye rendering
- Preserving IDs for cross-reference
- Processing multiple tournaments
- Adding custom transformations

## Integration

### Updated Files

**src/mock-data/flexible-bracket-data.ts**

- Added `sofascoredata` - Real UEFA Champions League 2021-22 data
- Added `sofascoreMappedBracket` - Pre-mapped example data
- Imported mapper function

**src/bracket-single/flexible-single-elim.stories.jsx**

- Added new story: "SofaScore Data (UEFA Champions League 2021-22)"
- Demonstrates the mapper with real tournament data

**index.ts**

- Exported `mapSofaScoreToMatches`
- Exported `mapSofaScoreToMatchesPreserveIds`
- Exported `SofaScoreData` type

## How It Works

### The Mapping Algorithm

```
1️⃣ FIRST PASS: Create blockId → matchId mapping
   - Iterate through all rounds and blocks
   - Assign sequential match IDs (or preserve block IDs)
   - Store mapping for lookup

2️⃣ SECOND PASS: Build nextMatchId relationships
   - For each block with hasNextRoundLink = true
   - Look in next round for blocks with participants having sourceBlockId = current block
   - Set nextMatchId to the found block's match ID

3️⃣ THIRD PASS: Create Match objects
   - Map all block data to Match format
   - Include participants, state, timestamps, etc.
   - Return complete Match array
```

### Data Structure Mapping

**SofaScore Block → Our Match**

```typescript
{
  blockId: 1614403           → id: 1 (or preserve as 1614403)
  hasNextRoundLink: true     → nextMatchId: 5 (calculated)
  description: "Quarterfinals" + order: 1 → name: "Quarterfinals - Match 1"
  finished: true             → state: "SCORE_DONE"
  participants: [...]        → participants: [...] (mapped)
  seriesStartDateTimestamp   → startTime: ISO string
}
```

**Key Insight:** The `sourceBlockId` in participants tells us which match they came from, allowing us to build the bracket tree backward from the final.

## Usage

### Basic Example

```typescript
import {
  mapSofaScoreToMatches,
  SofaScoreData,
} from 'react-tournament-brackets';

const sofaScoreData: SofaScoreData = await fetchFromAPI();
const matches = mapSofaScoreToMatches(sofaScoreData);

<FlexibleSingleEliminationBracket matches={matches} matchComponent={Match} />;
```

### Preserving IDs

```typescript
// Preserve SofaScore IDs
const matches = mapSofaScoreToMatchesPreserveIds(data);
```

## Example Data

The mapper includes a real-world example using UEFA Champions League 2021-22:

- **Round of 16:** 8 matches (Benfica vs Ajax, Inter vs Liverpool, etc.)
- **Quarter-finals:** 4 matches
- **Semi-finals:** 2 matches
- **Final:** Liverpool vs Real Madrid

View in Storybook: Navigate to **Components/FlexibleBracket → SofaScore Data**

## Testing

Run the test suite:

```bash
npm test sofascore-mapper.spec.ts
```

View in Storybook:

```bash
npm run storybook
```

## TypeScript Support

Full type definitions included:

```typescript
import type { SofaScoreData } from 'react-tournament-brackets';

// All SofaScore interfaces are exported
```

## Benefits

1. **Automatic Chain Building:** No manual nextMatchId configuration needed
2. **Flexible IDs:** Choose sequential or preserve original
3. **Type Safe:** Full TypeScript support
4. **Well Tested:** Comprehensive test coverage
5. **Documented:** Extensive README and examples
6. **Real Data:** Includes actual tournament data for reference

## Next Steps

You can now:

1. Use `mapSofaScoreToMatches` to convert your SofaScore API responses
2. Customize the mapped data as needed
3. Pass to `FlexibleSingleEliminationBracket` for rendering
4. View the example in Storybook for reference

## Questions?

See:

- `SOFASCORE_MAPPER_README.md` - Detailed usage guide
- `examples/sofascore-mapper-usage.tsx` - Real-world examples
- `src/utils/sofascore-mapper.spec.ts` - Test cases showing all features
