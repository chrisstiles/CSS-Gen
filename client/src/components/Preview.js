import React from 'react';

class Preview extends React.Component {
  render() {
    return (
      <div id="generator-preview">
        <Canvas>
          {this.props.children}
        </Canvas>
      </div>
    );
  }
}

class Canvas extends React.Component {
  render() {
    return (
      <div id="canvas">
        {this.props.children}
      </div>
    );
  }
}

export default Preview;