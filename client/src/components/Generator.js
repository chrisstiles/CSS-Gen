import React from 'react';
import Header from './Header';

class Generator extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {};

  //   for (var rule in props.cssRules) {
  //     this.state[rule] = props.cssRules[rule];
  //   }

  //   console.log(this.state)
  // }

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