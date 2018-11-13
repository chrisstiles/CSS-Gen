import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import Toggle from './input/Toggle';
import { addNotification, getNotificationTypes, updateGlobalState, getGlobalState, selectText, setGlobalVariable } from '../util/helpers';
import { default as SyntaxHighlighter, registerLanguage } from 'react-syntax-highlighter/dist/light';
import cssHighlighter from 'react-syntax-highlighter/dist/languages/hljs/css';

registerLanguage('css', cssHighlighter);

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.getCSS = this.getCSS.bind(this);
    this.copyCSS = this.copyCSS.bind(this);

    this.state = { 
      css: ''
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

  getCSS(newProps) {
    var css = newProps.outputCSS;

    if (newProps.outputPreviewStyles && newProps.previewCSS) {
      css += newProps.previewCSS;
    }

    css = `
      .selector-name {
        ${css}
      }
    `.trim();

    // Add plugins to format code and add prefixes if necessary
    const plugins = [prettify];
    const showPrefixes = getGlobalState().showBrowserPrefixes;

    if (showPrefixes && this.props.hasBrowserPrefixes) {
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
    if (!this.state.css) {
      return;
    }

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
    updateGlobalState({ showBrowserPrefixes: value });
  }

  renderPrefixesToggle() {
    if (this.props.hasBrowserPrefixes) {
      return (
        <div className="field-wrapper left small">
          <Toggle
            onChange={this.handleToggleChange}
            label="Browser Prefixes"
            checked={this.props.showBrowserPrefixes}
          />
        </div>
      );
    }
  }

  render() {
    var buttonClassName = 'button';
    var outputclassName = 'output-text';

    if (!this.state.css) {
      buttonClassName += ' disabled';
      outputclassName += ' disabled';
    }

    return (
      <div id="output-wrapper">
        <div className="sidebar-title">Code Output</div>
        <div id="output-code-wrapper">
          <CodeViewer language="css" code={this.state.css} />
        </div>
        {this.renderPrefixesToggle()}
        <button 
          onClick={this.copyCSS}
          className={buttonClassName}
        >
          Copy
        </button>
      </div>
    );
  }
}

class CodeViewer extends React.Component {
  constructor(props) {
    super(props);
    
    window.selectText = selectText;

    this.state = { selecting: false };

    this.disableOtherSelect = this.disableOtherSelect.bind(this);
    this.enableOtherSelect = this.enableOtherSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.enableOtherSelect);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.enableOtherSelect);
  }

  disableOtherSelect() {
    this.setState({ selecting: true });
    document.body.classList.add('no-select');
  }

  enableOtherSelect() {
    this.setState({ selecting: false });
    document.body.classList.remove('no-select');
  }

  handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
      const code = event.target.querySelector('.output-code');

      if (code) {
        event.preventDefault();
        selectText(code);
      }
    }
  }
  
  handleFocus() {
    setGlobalVariable(true, 'outputIsFocused');
  }

  handleBlur() {
    setGlobalVariable(false, 'outputIsFocused');
  }

  render() {
    const className = ['output-code'];

    if (this.state.selecting) {
      className.push('selecting-code');
    }

    return (
      <div
        className="language-wrapper"
        onMouseDown={this.disableOtherSelect}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        tabIndex="0"
      >
        <SyntaxHighlighter
          language={this.props.language}
          showLineNumbers={true}
          useInlineStyles={false}
          codeTagProps={{ className: className.join(' ') }}
        >
          {this.props.code}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodeOutput;

