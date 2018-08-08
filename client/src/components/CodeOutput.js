import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import Toggle from './input/Toggle';
import { addNotification, getNotificationTypes } from '../util/helpers';

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.getCSS = this.getCSS.bind(this);
    this.copyCSS = this.copyCSS.bind(this);

    this.state = { 
      css: '',
      showBrowserPrefixes: false
    };

    this.canShowCopyNotification = true;
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  componentWillMount() {
    const css = { outputCSS: this.props.outputCSS }

    css.previewCSS = this.props.previewCSS;
    css.outputPreviewStyles = this.props.outputPreviewStyles;

    this.getCSS(css);
  }

  componentWillReceiveProps(newProps) {
    this.getCSS(newProps);
  }

  getCSS(newProps, showBrowserPrefixes) {
    var css = newProps.outputCSS;

    if (newProps.outputPreviewStyles && newProps.previewCSS) {
      css += newProps.previewCSS;
    }

    // Add plugins to format code and add prefixes if necessary
    const plugins = [prettify];
    const showPrefixes = showBrowserPrefixes === undefined ? this.state.showBrowserPrefixes : showBrowserPrefixes;

    if (showPrefixes && this.props.browserPrefixes) {
      plugins.unshift(autoprefixer({ browsers: ['ie >= 8', '> 4%'] }));
    }

    const _this = this;

    postcss(plugins)
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

        addNotification(getNotificationTypes().success, 'Copied!');

        var _this = this;

        setTimeout(function() {
          _this.canShowCopyNotification = true;
        }, 400);
      }
      
    } catch (err) {
      console.log('Unable to copy', err);
    }

    document.body.removeChild(hiddenField);
  }

  handleToggleChange(value) {
    this.setState({ showBrowserPrefixes: value });
    this.getCSS(this.props, value);
  }

  renderPrefixesToggle() {
    if (this.props.browserPrefixes) {
      return (
        <div className="field-wrapper left small">
          <Toggle
            onChange={this.handleToggleChange}
            label="Browser Prefixes"
            defaultChecked={this.state.showBrowserPrefixes}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div id="output-wrapper">
        <div className="sidebar-title">Code Output</div>
        <div id="output-code-wrapper">
          <textarea
            id="output-code"
            autoCorrect="off"
            spellCheck="false"
            value={this.state.css}
            readOnly
          />
        </div>
        {this.renderPrefixesToggle()}
        <button 
          onClick={this.copyCSS}
          className="button"
        >
          Copy
        </button>
      </div>
    );
  }
}

export default CodeOutput;