import React from 'react';

class BottomContent extends React.PureComponent {
  render() {
    return (
      <div id="bottom-content-wrapper">
        <div id="bottom-content">
          <div id="options">
            {this.props.children}
          </div>
          <footer id="main-footer">
            Footer content goes here
          </footer>
        </div>
      </div>
    );
  }
}

export default BottomContent;