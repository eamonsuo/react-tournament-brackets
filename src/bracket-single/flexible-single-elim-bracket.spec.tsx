import React from 'react';
import { render } from '@testing-library/react';
import Match from 'Components/match';
import SVGViewer from '../svg-viewer';
import {
  fiveTeamBracket,
  sixTeamBracketWithSkippedByes,
} from '../mock-data/flexible-bracket-data';
import FlexibleSingleEliminationBracket from './flexible-single-elim-bracket';

it('Renders a flexible 5-team bracket without crashing', () => {
  render(
    <FlexibleSingleEliminationBracket
      matches={fiveTeamBracket}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
});

it('Renders a flexible 6-team bracket with skipped byes without crashing', () => {
  render(
    <FlexibleSingleEliminationBracket
      matches={sixTeamBracketWithSkippedByes}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
});

it('Renders a flexible bracket with visible bye indicators without crashing', () => {
  render(
    <FlexibleSingleEliminationBracket
      matches={sixTeamBracketWithSkippedByes}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
});
