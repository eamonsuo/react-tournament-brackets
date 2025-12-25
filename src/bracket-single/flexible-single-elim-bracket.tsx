import React from 'react';
import { ThemeProvider } from 'styled-components';
import { calculateSVGDimensions } from 'Core/calculate-svg-dimensions';
import { MatchContextProvider } from 'Core/match-context';
import MatchWrapper from 'Core/match-wrapper';
import RoundHeader from 'Components/round-header';
import { FlexibleSingleElimLeaderboardProps, Match } from '../types';
import { defaultStyle, getCalculatedStyles } from '../settings';
import { buildFlexibleColumnStructure } from 'Utils/flexible-bracket-helpers';
import {
  getPreviousMatchesFlexible,
  isByeMatch,
  getEffectiveByeRenderMode,
} from 'Utils/bracket-analysis';
import { calculateFlexibleMatchPosition } from './flexible-calculate-match-position';
import FlexibleConnectors from './flexible-connectors';
import defaultTheme from '../themes/themes';

/**
 * FlexibleSingleEliminationBracket - A bracket component that supports dynamic match counts per round.
 * Unlike the standard SingleEliminationBracket which requires a complete binary tree structure,
 * this component allows teams to start in any round, eliminating the need for excessive byes.
 */
const FlexibleSingleEliminationBracket = ({
  matches,
  matchComponent,
  currentRound,
  onMatchClick,
  onPartyClick,
  svgWrapper: SvgWrapper = ({ children }) => <div>{children}</div>,
  theme = defaultTheme,
  options: { style: inputStyle } = {
    style: defaultStyle,
  },
}: FlexibleSingleElimLeaderboardProps) => {
  const style = {
    ...defaultStyle,
    ...inputStyle,
    roundHeader: {
      ...defaultStyle.roundHeader,
      ...(inputStyle?.roundHeader ?? {}),
    },
    lineInfo: {
      ...defaultStyle.lineInfo,
      ...(inputStyle?.lineInfo ?? {}),
    },
  };

  const { roundHeader, columnWidth, canvasPadding, rowHeight, width } =
    getCalculatedStyles(style);

  // Find the final match
  const lastGame = matches.find(match => !match.nextMatchId);

  if (!lastGame) {
    console.warn('No final match found in bracket data');
    return null;
  }

  // Build flexible column structure (includes ALL matches)
  const columns = buildFlexibleColumnStructure(lastGame, matches);

  if (columns.length === 0) {
    console.warn('No columns generated for bracket');
    return null;
  }

  // Collect all participant IDs from the first round based on tournamentRoundText
  // Find the minimum round number
  const roundNumbers = matches
    .map(m => parseInt(m.tournamentRoundText || '0', 10))
    .filter(n => !isNaN(n) && n > 0);
  const firstRoundNumber =
    roundNumbers.length > 0 ? Math.min(...roundNumbers) : 1;

  // Get all participants from first round matches
  const firstRoundParticipantIds = new Set<string | number>();
  matches.forEach(match => {
    const roundNum = parseInt(match.tournamentRoundText || '0', 10);
    if (roundNum === firstRoundNumber) {
      match.participants.forEach(participant => {
        if (participant?.id) {
          firstRoundParticipantIds.add(participant.id);
        }
      });
    }
  });

  // Build a filtered version of columns for rendering and positioning
  // Show ALL matches, including those with no participants
  // This allows empty matches to render like the final match does
  const visibleColumns = columns.map(column => column);

  // Calculate SVG dimensions based on the maximum number of visible matches
  // Account for spacing between matches (spacing = rowHeight * 2.5)
  const maxVisibleMatchesInColumn = Math.max(
    ...visibleColumns.map(col => col.length)
  );

  // Use a more generous dimension calculation for flexible brackets
  // Add extra rows to account for vertical spacing in flexible positioning
  const effectiveRows = Math.max(maxVisibleMatchesInColumn * 3, 4);

  const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(
    effectiveRows,
    visibleColumns.length,
    rowHeight,
    columnWidth,
    canvasPadding,
    roundHeader,
    currentRound
  );

  return (
    <ThemeProvider theme={theme}>
      <SvgWrapper
        bracketWidth={gameWidth}
        bracketHeight={gameHeight}
        startAt={startPosition}
      >
        <svg
          height={gameHeight}
          width={gameWidth}
          viewBox={`0 0 ${gameWidth} ${gameHeight}`}
        >
          <MatchContextProvider>
            <g>
              {visibleColumns.map((matchesColumn, columnIndex) =>
                matchesColumn.map((match, rowIndex) => {
                  const { x, y } = calculateFlexibleMatchPosition(
                    match,
                    rowIndex,
                    columnIndex,
                    visibleColumns,
                    matches,
                    {
                      canvasPadding,
                      columnWidth,
                      rowHeight,
                    }
                  );

                  const previousMatches = getPreviousMatchesFlexible(
                    match,
                    matches
                  );

                  // Include ALL previous matches for connector drawing
                  const visiblePreviousMatches = previousMatches;

                  // Determine if this is a bye match and how to render it
                  const isBye = isByeMatch(match);
                  const byeMode = getEffectiveByeRenderMode(match);

                  // Determine which participants are late entries
                  // A participant is a late entry if they're NOT in the first round
                  const lateEntryParticipantIds = new Set<string | number>();
                  match.participants.forEach(participant => {
                    if (
                      participant?.id &&
                      !firstRoundParticipantIds.has(participant.id)
                    ) {
                      lateEntryParticipantIds.add(participant.id);
                    }
                  });

                  // Get match name - add bye indicator if needed
                  let displayName = match.name;
                  if (isBye && byeMode === 'show-with-indicator') {
                    const nextRound = match.tournamentRoundText
                      ? parseInt(match.tournamentRoundText, 10) + 1
                      : columnIndex + 2;
                    displayName = `Bye to Round ${nextRound}`;
                  }

                  return (
                    <g key={`${match.id}-${columnIndex}-${rowIndex}`}>
                      {roundHeader.isShown && (
                        <RoundHeader
                          x={x}
                          roundHeader={roundHeader}
                          canvasPadding={canvasPadding}
                          width={width}
                          numOfRounds={visibleColumns.length}
                          tournamentRoundText={match.tournamentRoundText}
                          columnIndex={columnIndex}
                        />
                      )}
                      {columnIndex !== 0 &&
                        visiblePreviousMatches.length > 0 && (
                          <FlexibleConnectors
                            bracketSnippet={{
                              currentMatch: match,
                              previousMatches: visiblePreviousMatches,
                            }}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            style={style}
                            columns={visibleColumns}
                            allMatches={matches}
                          />
                        )}
                      <g>
                        <MatchWrapper
                          x={x}
                          y={
                            y +
                            (roundHeader.isShown
                              ? roundHeader.height + roundHeader.marginBottom
                              : 0)
                          }
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          match={match}
                          previousBottomMatch={
                            visiblePreviousMatches[1] || null
                          }
                          topText={match.startTime.toLocaleString()}
                          bottomText={displayName}
                          teams={match.participants}
                          onMatchClick={onMatchClick}
                          onPartyClick={onPartyClick}
                          style={style}
                          matchComponent={matchComponent}
                          lateEntryParticipantIds={lateEntryParticipantIds}
                        />
                      </g>
                    </g>
                  );
                })
              )}
            </g>
          </MatchContextProvider>
        </svg>
      </SvgWrapper>
    </ThemeProvider>
  );
};

export default FlexibleSingleEliminationBracket;
