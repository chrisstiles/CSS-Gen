import React from 'react';

class Toolbar extends React.Component {
  render() {
    return (
      <div id="toolbar">{this.props.children}</div>
    );
  }
}

export default Toolbar;