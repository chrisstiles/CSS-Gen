import React from 'react';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import prettyHTML from 'pretty';
import * as clipboard from 'clipboard-polyfill/build/clipboard-polyfill.promise'
import Toggle from './input/Toggle';
import { addNotification, getNotificationTypes, updateGlobalState, getGlobalState, selectText, setGlobalVariable } from '../util/helpers';
import createElement from 'react-syntax-highlighter/dist/create-element';
import { default as SyntaxHighlighter, registerLanguage } from 'react-syntax-highlighter/dist/light';
import cssHighlighter from 'react-syntax-highlighter/dist/languages/hljs/css';
import htmlHighlighter from 'react-syntax-highlighter/dist/languages/hljs/xml';

registerLanguage('css', cssHighlighter);
registerLanguage('html', htmlHighlighter);

class CodeOutput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outputCode: '',
      copyCode: '',
      disableEditor: false
    };

    this.getCode = this.getCode.bind(this);
    this.getCSS = this.getCSS.bind(this);
    this.copyCode = this.copyCode.bind(this);

    this.canShowCopyNotification = true;
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  componentWillMount() {
    const code = { outputCode: this.props.outputCode }

    code.previewCSS = this.props.previewCSS;
    code.outputPreviewStyles = this.props.outputPreviewStyles;


    this.getCode(code);
  }

  componentWillReceiveProps(newProps) {
    this.getCode(newProps);
  }

  getCode(props) {
    if (this.props.language.toLowerCase() === 'css') {
      this.getCSS(props);
    } else {
      const outputCode = prettyHTML(props.outputCode);

      this.setState({ outputCode, copyCode: outputCode, disableEditor: !outputCode });
    }
  }

  getCSS(props) {
    let css = props.outputCode;

    if (props.outputPreviewStyles && props.previewCSS) {
      css += props.previewCSS;
    }

    // Disable editor if no CSS is passed
    css = css.trim();
    const disableEditor = !css;

    // Add plugins to format code and add prefixes if necessary
    const plugins = [prettify];
    const showPrefixes = getGlobalState().showBrowserPrefixes;

    if (showPrefixes && this.props.hasBrowserPrefixes) {
      plugins.unshift(autoprefixer({ browsers: ['ie >= 8', '> 4%'] }));
    }


    postcss(plugins)
      .process(css, { from: undefined })
      .then(result => {
        result.warnings().forEach(warn => {
          console.warn(warn.toString());
        });

        let { css: outputCode } = result;
        const copyCode = outputCode;

        // Use correct syntax highlighting even if we don't have 
        // a CSS selector present in output string
        if (css.indexOf('{') === -1) {
          this.hideSelector = true;
          outputCode = `.selector {\n${outputCode}\n}`;
        } else {
          this.hideSelector = false;
        }

        this.setState({ outputCode, copyCode, disableEditor });
      });
  }

  copyCode() {
    if (!this.state.copyCode) {
      return;
    }

    clipboard.writeText(this.state.copyCode).then((text, error) => {
      if (!error) {
        addNotification(getNotificationTypes().success, 'Copied!');
      }
    });
  }

  handleToggleChange(value) {
    updateGlobalState({ showBrowserPrefixes: value });
  }

  renderPrefixesToggle() {
    if (this.props.language.toLowerCase() !== 'css' || !this.props.hasBrowserPrefixes) {
      return '';
    }

    return (
      <div className="field-wrapper small">
        <Toggle
          onChange={this.handleToggleChange}
          label="Browser Prefixes"
          inline={true}
          disabled={!this.props.hasBrowserPrefixes}
          checked={this.props.showBrowserPrefixes && this.props.hasBrowserPrefixes}
        />
      </div>
    );
  }

  render() {
    const wrapperClassName = ['output-wrapper', this.props.language.toLowerCase()];
    const buttonClassName = ['button', 'small'];

    if (this.state.disableEditor) {
      buttonClassName.push('disabled');
    }

    return (
      <div className={wrapperClassName.join(' ')}>
        <div className="bottom-title color">Code Output</div>
        <CodeViewer
          language={this.props.language}
          code={this.state.outputCode}
          hideSelector={this.hideSelector}
          disableEditor={this.state.disableEditor}
        />
        <div className="bottom">
          {this.renderPrefixesToggle()}
          <button
            onClick={this.copyCode}
            className={buttonClassName.join(' ')}
          >
            Copy
          </button>
        </div>
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

    const { disableEditor, hideSelector, code } = this.props;

    if (disableEditor) {
      wrapperClassName.push('disabled');
    }

    if (hideSelector) {
      wrapperClassName.push('hide-selector');
    }

    const renderer = this.props.language.toLowerCase() === 'css' ? this.renderCSS : null;

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
          codeTagProps={{ className: className.join(' ') }}
          renderer={renderer}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodeOutput;

