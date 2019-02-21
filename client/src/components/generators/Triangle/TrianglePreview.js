import React from 'react';
import Preview from '../../Preview';

class TrianglePreview extends React.Component {
  render() {
    const { canvasColor, ...previewProps } = this.props;
    return (
      <Preview canvasColor={canvasColor} className="center">
        <div style={{ ...previewProps }}></div>
      </Preview>
    );
  }
}

export default TrianglePreview;