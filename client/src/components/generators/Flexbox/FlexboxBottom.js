import React from 'react';
import FlexboxPresets from './FlexboxPresets';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import Toggle from '../../input/Toggle';
// import ColorPicker from '../../input/ColorPicker';

class FlexBoxBottom extends React.Component {
  render() {
    const { 
      output,
      showAddButton,
      isFullHeight,
      canvasColor,
      updateGenerator
    } = this.props;

    return (
      <BottomContent output={output}>
        <Settings 
          updateGenerator={updateGenerator}
          canvasColor={canvasColor}
        >
          <Toggle
            name="showAddButton"
            label="Add Button"
            onChange={updateGenerator}
            checked={showAddButton}
          />
          <Toggle
            name="isFullHeight"
            label="Full Height"
            onChange={updateGenerator}
            checked={isFullHeight}
          />
        </Settings>
        <FlexboxPresets />
      </BottomContent>
    );
  }
}

export default FlexBoxBottom;