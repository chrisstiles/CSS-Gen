import React from 'react';
import { propsHaveChanged } from '../util/helpers';

class BottomContent extends React.Component {
  shouldComponentUpdate(prevProps) {
    return propsHaveChanged(prevProps, this.props);
  }

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