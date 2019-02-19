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
      updatePreview
    } = this.props;

    return (
      <BottomContent output={output}>
        <Settings 
          updatePreview={updatePreview}
          canvasColor={canvasColor}
          disabledCanvasPattern={true}
        >
          <Toggle
            name="showAddButton"
            label="Add Button"
            onChange={updatePreview}
            checked={showAddButton}
          />
          <Toggle
            name="isFullHeight"
            label="Full Height"
            onChange={updatePreview}
            checked={isFullHeight}
          />
        </Settings>
        <FlexboxPresets />
      </BottomContent>
    );
  }
}

export default FlexBoxBottom;