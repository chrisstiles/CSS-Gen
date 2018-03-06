import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.getCSS = this.getCSS.bind(this);

    this.state = { css: '' };
  }

  componentWillMount() {
    this.getCSS();
  }

  componentWillReceiveProps() {
    this.getCSS();
  }

  getCSS() {
    var css = `${this.props.property}: ${this.props.generateCSS()};`;
    var _this = this;

    postcss([ autoprefixer({ browsers: ['ie >= 9', '> 2%'] }), prettify ])
      .process(css, { from: undefined })
      .then(function (result) {
        result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });
        
        _this.setState({ css: result.css });
    });

  }

  render() {
    return (
      <textarea
        id="output"
        value={this.state.css}
        readOnly="readonly"
      />
    );
  }
}

export default CodeOutput;