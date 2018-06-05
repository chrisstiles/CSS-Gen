import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import { addNotification, notificationTypes } from './App';

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.getCSS = this.getCSS.bind(this);
    this.copyCSS = this.copyCSS.bind(this);

    this.state = { css: '' };

    this.canShowCopyNotification = true;
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

  copyCSS() {
    const hiddenField = document.createElement('textarea');

    hiddenField.style.position = 'fixed';
    hiddenField.style.opacity = 0;
    hiddenField.style.top = -500;
    hiddenField.value = this.state.css;

    document.body.appendChild(hiddenField);

    hiddenField.select();

    try {
      document.execCommand('copy');

      if (this.canShowCopyNotification) {
        this.canShowCopyNotification = false;

        addNotification(notificationTypes.success, 'Copied!');  

        var _this = this;

        setTimeout(function() {
          _this.canShowCopyNotification = true;
        }, 400);
      }
      
    } catch (err) {
      console.log('Unable to copy');
    }

    document.body.removeChild(hiddenField);
  }

  render() {
    return (
      <div id="output-wrapper">
        <div className="sidebar-title">Code Output</div>
        <textarea
          id="output"
          autoCorrect="off"
          spellCheck="false"
          value={this.state.css}
        />
        <button 
          onClick={this.copyCSS}
          className="button"
        >
          Copy to Clipboard
        </button>
      </div>
    );
  }
}

export default CodeOutput;