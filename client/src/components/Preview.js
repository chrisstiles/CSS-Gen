import React from 'react';

class Preview extends React.Component {
  render() {
    const { canvasColor, children, ...previewProps } = this.props;
    const preview = children ? children : (
      <DefaultPreview {...previewProps} />
    );

    return (
      <div id="generator-preview">
        <Canvas color={canvasColor}>
          {preview}
        </Canvas>
      </div>
    );
  }
}

const Canvas = ({ color: backgroundColor = 'transparent', children }) => {
  return (
    <div id="canvas" style={{ backgroundColor }}>
      {children}
    </div>
  );
};

class DefaultPreview extends React.Component {
  render() {
    return 'Default preview here';
  }
}

export default Preview;