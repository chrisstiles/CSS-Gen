import React from 'react';
import FlexboxPresets from './FlexboxPresets';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import Toggle from '../../input/Toggle';
import ColorPicker from '../../input/ColorPicker';

class FlexBoxBottom extends React.Component {
  render() {
    const { 
      output,
      showAddItemButton,
      fullHeightContainer,
      updateGenerator
    } = this.props;

    return (
      <BottomContent output={output}>
        <Settings>
          <Toggle
            name="showAddItemButton"
            label="Add Button"
            onChange={updateGenerator}
            checked={showAddItemButton}
          />
          <Toggle
            name="fullHeightContainer"
            label="Full Height"
            onChange={updateGenerator}
            checked={fullHeightContainer}
          />
        </Settings>
        <FlexboxPresets />
      </BottomContent>
    );
  }
}

export default FlexBoxBottom;