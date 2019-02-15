import React from 'react';
// import 

class Preview extends React.Component {
  render() {
    return (
      <div id="generator-preview">
        <Canvas color={this.props.canvasColor}>
          {this.props.children}
        </Canvas>
      </div>
    );
  }
}

class Canvas extends React.Component {  
  render() {
    const { 
      color: backgroundColor = 'transparent',
      children
    } = this.props;

    return (
      <div id="canvas" style={{ backgroundColor }}>
        {children}
      </div>
    );
  }
}

export default Preview;