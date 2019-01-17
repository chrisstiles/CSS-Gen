import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import * as clipboard from 'clipboard-polyfill/build/clipboard-polyfill.promise'
import Toggle from './input/Toggle';
import { addNotification, getNotificationTypes, updateGlobalState, getGlobalState, selectText, setGlobalVariable } from '../util/helpers';
import createElement from 'react-syntax-highlighter/dist/create-element';
import { default as SyntaxHighlighter, registerLanguage } from 'react-syntax-highlighter/dist/light';
import cssHighlighter from 'react-syntax-highlighter/dist/languages/hljs/css';

registerLanguage('css', cssHighlighter);

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.getCSS = this.getCSS.bind(this);
    this.copyCSS = this.copyCSS.bind(this);

    this.state = { 
      outputCSS: '',
      copyCSS: ''
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

    // Add plugins to format code and add prefixes if necessary
    const plugins = [prettify];
    const showPrefixes = getGlobalState().showBrowserPrefixes;

    if (showPrefixes && this.props.hasBrowserPrefixes) {
      plugins.unshift(autoprefixer({ browsers: ['ie >= 8', '> 4%'] }));
    }

    const _this = this;

    postcss(plugins)
      .process(css.trim(), { from: undefined })
      .then(function (result) {
        result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });

        let { css: outputCSS } = result;
        const copyCSS = outputCSS;

        // Use correct syntax highlighting even if we don't have 
        // a CSS selector present in output string
        if (css.indexOf('{') === -1) {
          _this.hideSelector = true;
          outputCSS = `.selector {\n${outputCSS}\n}`;
        } else {
          _this.hideSelector = false;
        }

        _this.setState({ outputCSS, copyCSS });
        
    });
  }

  copyCSS() {
    if (!this.state.copyCSS) {
      return;
    }

    clipboard.writeText(this.state.copyCSS).then((text, error) => {
      if (!error) {
        addNotification(getNotificationTypes().success, 'Copied!');
      }
    });
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
    let buttonClassName = 'button';

    // let startingLine = 
    if (!this.state.outputCSS) {
      buttonClassName += ' disabled';
    }

    return (
      <div id="output-wrapper">
        <div className="sidebar-title">Code Output</div>
        <div id="output-code-wrapper">
          <CodeViewer 
            language="css" 
            code={this.state.outputCSS} 
            hideSelector={this.hideSelector} 
          />
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
    this.renderCSS = this.renderCSS.bind(this);

    // Prevent syntax highlighter from cluttering console log
    const log = console.log;
    console.log = function() {
      const args = Array.prototype.slice.call(arguments);
      if (args[1] !== 'conor') {
        log.apply(this, args);
      }
    }
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

  renderCSS({ rows, stylesheet, useInlineStyles }) {
    if (this.props.hideSelector) {
      rows = rows.slice(1, -1);
    }

    return rows.map((node, i) => {
      return createElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`
      });
    });
  }

  render() {
    const wrapperClassName = ['language-wrapper'];
    const className = ['output-code'];

    if (this.state.selecting) {
      className.push('selecting-code');
    }

    const { hideSelector, code } = this.props;

    if (hideSelector) {
      wrapperClassName.push('hide-selector');
    }

    // let startingLineNumber = 1;


    return (
      <div
        className={wrapperClassName.join(' ')}
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
          // startingLineNumber={startingLineNumber}
          // wrapLines={true}
          codeTagProps={{ className: className.join(' ') }}
          renderer={this.renderCSS}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }
}

function rowRenderer({ rows, stylesheet, useInlineStyles }, { index, key, style }) {
  return createElement({
    node: rows[index],
    stylesheet,
    style,
    useInlineStyles,
    key
  });
}

export default CodeOutput;

