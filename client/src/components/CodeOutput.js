import React from 'react';
// import postcss from 'postcss';
// import autoprefixer from 'autoprefixer';
// import prettify from 'postcss-prettify';
// import prettyHTML from 'pretty';
import * as clipboard from 'clipboard-polyfill/build/clipboard-polyfill.promise'
import Toggle from './input/Toggle';
import createElement from 'react-syntax-highlighter/dist/create-element';
import { registerLanguage } from 'react-syntax-highlighter/dist/light';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import cssHighlighter from 'react-syntax-highlighter/dist/languages/hljs/css';
import htmlHighlighter from 'react-syntax-highlighter/dist/languages/hljs/xml';
import { 
  addNotification, 
  getNotificationTypes, 
  updateGlobalState, 
  formatCode,
  cloneObject, 
  selectText, 
  setGlobalVariable 
} from '../util/helpers';

registerLanguage('css', cssHighlighter);
registerLanguage('html', htmlHighlighter);

// Only one code viewer can be expanded at a time
let currentExpandedOutput = null;

class CodeOutput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      outputCode: '',
      copyCode: '',
      disableEditor: false,
      expanded: false
    };

    this.expand = this.expand.bind(this);
    this.close = this.close.bind(this);
    this.getCode = this.getCode.bind(this);
    this.getCSS = this.getCSS.bind(this);
    this.copyCode = this.copyCode.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);

    this.canShowCopyNotification = true;
  }

  componentWillMount() {
    this.getCode(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.outputCode !== this.props.outputCode || 
      prevProps.showBrowserPrefixes !== this.props.showBrowserPrefixes ||
      prevProps.outputPreviewStyles !== this.props.outputPreviewStyles
    ) {
      this.getCode(this.props);
    }
  }

  handleFocus(event) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    this.hasFocus = true;
    setGlobalVariable(true, 'outputIsFocused');
  }

  handleBlur() {
    this.hasFocus = false;
    setGlobalVariable(false, 'outputIsFocused');
  }

  expand() {
    if (currentExpandedOutput) {
      currentExpandedOutput.close();
    }

    currentExpandedOutput = this;

    this.setState({ expanded: true, selecting: false });

    document.body.classList.remove('no-select');
    document.body.classList.add('code-expanded');
  }

  close() {
    currentExpandedOutput = null;
    this.setState({ expanded: false, selecting: false });

    document.body.classList.remove('no-select');
    document.body.classList.remove('code-expanded');
  }

  getCode(newProps) {
    const props = cloneObject(newProps);

    if (this.props.language.toLowerCase() === 'css') {
      this.getCSS(props);
    } else {
      // const outputCode = prettyHTML(props.outputCode);
      const outputCode = formatCode(props.outputCode, props.language);

      this.setState({ outputCode, copyCode: outputCode, disableEditor: !outputCode });
    }
  }

  getCSS(props) {
    let css = props.outputCode;

    if (props.outputPreviewStyles && props.previewCSS) {
      css += `\n${formatCode(props.previewCSS)}`;
    }

    // Disable editor if no CSS is passed
    // css = css.trim();
    const disableEditor = !css;

    // Add plugins to format code and add prefixes if necessary
    // const { showBrowserPrefixes, hasBrowserPrefixes } = props;
    // const plugins = [prettify];
    
    // if (showBrowserPrefixes && hasBrowserPrefixes) {
    //   plugins.unshift(autoprefixer({ browsers: ['ie >= 8', '> 4%'] }));
    // }

    let outputCode = formatCode(css, props.language);
    let copyCode = outputCode;

    if (css.indexOf('{') === -1) {
      this.hideSelector = true;
      outputCode = `.selector {\n${outputCode}\n}`;
    } else {
      this.hideSelector = false;
    }

    this.setState({ outputCode, copyCode, disableEditor });


    // postcss(plugins)
    //   .process(css, { from: undefined })
    //   .then(result => {
    //     result.warnings().forEach(warn => {
    //       console.warn(warn.toString());
    //     });

    //     let { css: outputCode } = result;
    //     const copyCode = outputCode;

    //     // Use correct syntax highlighting even if we don't have 
    //     // a CSS selector present in output string
    //     if (css.indexOf('{') === -1) {
    //       this.hideSelector = true;
    //       outputCode = `.selector {\n${outputCode}\n}`;
    //     } else {
    //       this.hideSelector = false;
    //     }

    //     this.setState({ outputCode, copyCode, disableEditor });
    //   });
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
    const { disableEditor, outputCode, expanded } = this.state;
    const { language } = this.props;
    const wrapperClassName = ['output-wrapper', language.toLowerCase()];
    const buttonClassName = ['button', 'small'];

    if (disableEditor) {
      buttonClassName.push('disabled');
    }

    if (expanded) {
      wrapperClassName.push('expanded');
    }

    const createViewer = isExpanded => {
      const handleClick = isExpanded ? this.close : this.expand;
      const outputWrapperProps = {
        className: wrapperClassName.join(' ')
      };

      if (!isExpanded) {
        outputWrapperProps.key = `${language}-collapsed`;
      }

      const output = (
        <div {...outputWrapperProps}>
          <div className="bottom-title color">
            <span>Generater Output</span>
            <div
              className="expand-toggle"
              onClick={handleClick}
            ></div>
          </div>
          <CodeViewer
            language={language}
            code={outputCode}
            hideSelector={this.hideSelector}
            disableEditor={disableEditor}
            isExpanded={isExpanded}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
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

      if (!isExpanded) {
        return output;
      }

      return (
        <div
          className="expanded-code-wrapper"
          key={`${language}-expanded`}
        >
          {output}
        </div>
      );
    }

    const viewers = [createViewer()];

    if (expanded) {
      viewers.unshift(createViewer(true));
    }

    return viewers;
  }
}

class CodeViewer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { selecting: false };

    this.disableOtherSelect = this.disableOtherSelect.bind(this);
    this.enableOtherSelect = this.enableOtherSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderCSS = this.renderCSS.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.enableOtherSelect);

    if (this.wrapper && this.props.isExpanded) {
      this.wrapper.scrollIntoView();
      selectText(this.wrapper.querySelector('.output-code'));
    }
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

  renderCSS({ rows, stylesheet, useInlineStyles }) {
    if (this.props.hideSelector) {
      rows = rows.slice(1, -1);
    }

    const code = rows.map((node, i) => {
      return createElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`
      });
    });

    return code;
  }

  render() {
    const wrapperClassName = ['language-wrapper'];
    const className = ['output-code'];
    const { language, disableEditor, hideSelector, code, isExpanded, onFocus, onBlur } = this.props;

    if (this.state.selecting || isExpanded) {
      wrapperClassName.push('selecting-code');
      className.push('selecting-code');
    }

    if (disableEditor) {
      wrapperClassName.push('disabled');
    }

    if (hideSelector) {
      wrapperClassName.push('hide-selector');
    }

    const renderer = language.toLowerCase() === 'css' ? this.renderCSS : null;

    return (
      <div
        className={wrapperClassName.join(' ')}
        onMouseDown={this.disableOtherSelect}
        onKeyDown={this.handleKeyDown}
        ref={wrapper => { this.wrapper = wrapper }}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex="0"
      >
        <SyntaxHighlighter
          language={language}
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

