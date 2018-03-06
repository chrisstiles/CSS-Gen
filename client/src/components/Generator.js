import React from 'react';
import Header from './Header';

class Generator extends React.Component {
  render() {
    return (
      <div id="generator-wrapper">
        <Header title={this.props.title} />
        <div id="generator" className="page-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Generator;