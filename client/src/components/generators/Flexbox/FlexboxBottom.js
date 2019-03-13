import React from 'react';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import Toggle from '../../input/Toggle';

class FlexboxBottom extends React.Component {
  render() {
    const { 
      showAddButton,
      isFullHeight,
      canvasColor,
      shouldChildNumber,
      updatePreview
    } = this.props;

    return (
      <BottomContent>
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
          <Toggle
            name="shouldChildNumber"
            label="Show Child Number"
            onChange={updatePreview}
            checked={shouldChildNumber}
          />
        </Settings>
      </BottomContent>
    );
  }
}

export default FlexboxBottom;