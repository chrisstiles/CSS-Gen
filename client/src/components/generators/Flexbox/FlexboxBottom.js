import React from 'react';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import Toggle from '../../input/Toggle';

class FlexboxBottom extends React.PureComponent {
  render() {
    const { 
      showAddButton,
      isFullHeight,
      canvasColor,
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
        </Settings>
      </BottomContent>
    );
  }
}

export default FlexboxBottom;