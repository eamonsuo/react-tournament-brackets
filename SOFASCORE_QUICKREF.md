# Quick Reference: SofaScore Mapper

## Import

```typescript
import {
  mapSofaScoreToMatches,
  mapSofaScoreToMatchesPreserveIds,
  FlexibleSingleEliminationBracket,
  Match,
  type SofaScoreData,
} from 'react-tournament-brackets';
```

## Basic Usage

```typescript
// 1. Get your SofaScore data
const sofaScoreData: SofaScoreData = await fetch(url).then(r => r.json());

// 2. Convert to bracket format
const matches = mapSofaScoreToMatches(sofaScoreData);

// 3. Render
<FlexibleSingleEliminationBracket matches={matches} matchComponent={Match} />;
```

## Options

### Preserve Original IDs

```typescript
// Use SofaScore block IDs instead of sequential IDs
mapSofaScoreToMatchesPreserveIds(data);
```

## What Gets Mapped

| SofaScore                            | →   | Your Match Object |
| ------------------------------------ | --- | ----------------- |
| `blockId`                            | →   | `id`              |
| `hasNextRoundLink` + `sourceBlockId` | →   | `nextMatchId`     |
| `description` + `order`              | →   | `name`            |
| `finished` / `eventInProgress`       | →   | `state`           |
| `participants[].team`                | →   | `participants[]`  |
| `participants[].winner`              | →   | `isWinner`        |
| `seriesStartDateTimestamp`           | →   | `startTime`       |

## Key Points

✅ Automatically builds `nextMatchId` chain  
✅ Handles bye matches  
✅ Converts timestamps  
✅ Maps team data to participants  
✅ Type-safe with TypeScript

## Example SofaScore URL

```
https://api.sofascore.com/api/v1/unique-tournament/{tournamentId}/season/{seasonId}/cup-trees
```

Example (UEFA Champions League):

```
https://api.sofascore.com/api/v1/unique-tournament/7/season/41897/cup-trees
```

## See Also

- **Detailed Docs:** `SOFASCORE_MAPPER_README.md`
- **Examples:** `examples/sofascore-mapper-usage.tsx`
- **Tests:** `src/utils/sofascore-mapper.spec.ts`
- **Storybook:** Components → FlexibleBracket → SofaScore Data
