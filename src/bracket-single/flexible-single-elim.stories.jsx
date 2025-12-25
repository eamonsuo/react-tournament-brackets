import React from 'react';
import useWindowSize from 'Hooks/use-window-size';
import styled from 'styled-components';
import Match from 'Components/match';
import { createTheme } from 'Themes/themes';
import FlexibleSingleEliminationBracket from './flexible-single-elim-bracket';
import SvgViewer from '../svg-viewer';
import {
  fiveTeamBracket,
  sixTeamBracketWithSkippedByes,
  sixTeamBracketWithVisibleByes,
  mixedModeBracket,
  irregularBracket,
} from '../mock-data/flexible-bracket-data';
import { sofascoreMappedBracket } from '../mock-data/sofascore-mapped';

export default {
  title: 'Components/FlexibleBracket',
  component: FlexibleSingleEliminationBracket,
};

const StyledSvgViewer = styled(SvgViewer).attrs(props => {
  return {
    background: props.theme.canvasBackground,
    SVGBackground: props.theme.canvasBackground,
  };
})``;

function Template({ ...args }) {
  const [width, height] = useWindowSize();
  const finalWidth = Math.max(width - 50, 500);
  const finalHeight = Math.max(height - 100, 500);
  return (
    <FlexibleSingleEliminationBracket
      svgWrapper={({ children, ...props }) => (
        <StyledSvgViewer width={finalWidth} height={finalHeight} {...props}>
          {children}
        </StyledSvgViewer>
      )}
      {...args}
    />
  );
}

export const FiveTeamBracket = Template.bind({});
FiveTeamBracket.args = {
  matches: fiveTeamBracket,
  matchComponent: Match,
};
FiveTeamBracket.storyName = '5-Team Bracket (Dynamic Rounds)';

export const SixTeamWithSkippedByes = Template.bind({});
SixTeamWithSkippedByes.args = {
  matches: sixTeamBracketWithSkippedByes,
  matchComponent: Match,
};
SixTeamWithSkippedByes.storyName = '6-Team Bracket (Byes Hidden)';

export const SixTeamWithVisibleByes = Template.bind({});
SixTeamWithVisibleByes.args = {
  matches: sixTeamBracketWithVisibleByes,
  matchComponent: Match,
};
SixTeamWithVisibleByes.storyName = '6-Team Bracket (Byes Visible)';

export const MixedModeBracket = Template.bind({});
MixedModeBracket.args = {
  matches: mixedModeBracket,
  matchComponent: Match,
};
MixedModeBracket.storyName = 'Mixed Bye Rendering (Per-Match Override)';

export const IrregularBracket = Template.bind({});
IrregularBracket.args = {
  matches: irregularBracket,
  matchComponent: Match,
};
IrregularBracket.storyName =
  'Irregular Bracket (Teams Start at Different Rounds)';

export const WithCustomTheme = Template.bind({});
WithCustomTheme.args = {
  matches: fiveTeamBracket,
  matchComponent: Match,
  theme: createTheme({
    textColor: {
      main: '#000000',
      highlighted: '#07090D',
      dark: '#3E414D',
      disabled: '#8F95A3',
    },
    matchBackground: {
      wonColor: '#daebf9',
      lostColor: '#96c6da',
    },
    score: {
      background: {
        wonColor: '#87b2c4',
        lostColor: '#87b2c4',
      },
      text: {
        highlightedWonColor: '#7BF59D',
        highlightedLostColor: '#FB7E94',
      },
    },
    border: {
      color: '#CED1F2',
      highlightedColor: '#da96c6',
    },
    roundHeaders: {
      background: '#da96c6',
    },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
  }),
};
WithCustomTheme.storyName = 'Flexible Bracket with Custom Theme';

export const AllByesVisible = Template.bind({});
AllByesVisible.args = {
  matches: irregularBracket,
  matchComponent: Match,
};
AllByesVisible.storyName = 'All Byes Visible (Show Starting Rounds)';

export const SofaScoreBracket = Template.bind({});
SofaScoreBracket.args = {
  matches: sofascoreMappedBracket,
  matchComponent: Match,
};
SofaScoreBracket.storyName = 'SofaScore Data (UEFA Champions League 2021-22)';
