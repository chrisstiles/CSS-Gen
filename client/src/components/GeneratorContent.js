import React from 'react';
import CodeOutput from './CodeOutput';
import GeneratorSettings from './GeneratorSettings';
import { isArray } from 'underscore';

class GeneratorOutput extends React.PureComponent {
  constructor(props) {
    super(props);
    
    // Will use fallback for output if position: sticky is not supported
    this.hasStickySupport = function() {
      const el = document.createElement('a');
      const mStyle = el.style;
      mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
      return mStyle.position.indexOf('sticky') !== -1;
    }();

    this.outputHeight = 0;
    this.isFixed = false;
  }

  componentDidMount() {
    if (!this.hasStickySupport) {
      this.positionWrapper();
      window.addEventListener('scroll', this.positionWrapper, true);
      window.addEventListener('resize', this.positionWrapper, true);
    }
  }

  componentWillUnmount() {
    if (!this.hasStickySupport) {
      window.removeEventListener('scroll', this.positionWrapper);
      window.removeEventListener('resize', this.positionWrapper);
    }
  }

  componentDidUpdate() {
    if (!this.hasStickySupport) this.positionWrapper();
  }

  updateWrapperHeight = () => {
    if (!this.wrapper || !this.content) return;

    const height = this.content.offsetHeight;

    if (this.outputHeight !== height) {
      this.wrapper.style.minHeight = `${height}px`;
      this.outputHeight = height;
    }
  }

  positionWrapper = event => {
    if (!this.wrapper || !this.wrapper.parentElement) return;

    if (window.pageYOffset >= this.wrapper.parentElement.offsetTop) {
      if (!this.isFixed) {
        this.wrapper.classList.add('fixed');
        this.isFixed = true;
      }
    } else {
      if (this.isFixed) {
        this.wrapper.classList.remove('fixed');
        this.isFixed = false;
      }
    }

    this.updateWrapperHeight();
  }

  render() {
    let { output } = this.props;
    if (!isArray(output)) output = [output];

    const codeViewers = output.map(({ language, code }) => {
      return (
        <CodeOutput
          key={language}
          language={language}
          code={code}
        />
      );
    });

    const outputWrapperProps = { id: 'generator-output', className: [] };
    if (output.length > 1) outputWrapperProps.className.push('multiple');
    if (this.isFixed) outputWrapperProps.className.push('fixed');
    if (!this.hasStickySupport) outputWrapperProps.className.push('no-sticky');
    outputWrapperProps.className = outputWrapperProps.className.join(' ');

    return (
      <div 
        ref={wrapper => { this.wrapper = wrapper }}
        {...outputWrapperProps}
      >
        <div id="output-scroller">
          <div 
            id="output-content" 
            ref={content => { this.content = content }}
          >
            {codeViewers}
          </div>
        </div>
      </div>
    );
  }
}

class GeneratorContent extends React.PureComponent {
  render() {
    const { 
      previewSettings,
      output,
      canvasColor,
      updatePreview,
      children,
      globalState
    } = this.props;

    return (
      <div id="generator-content-wrapper">
        <GeneratorOutput output={output} />
        <GeneratorSettings
          canvasColor={canvasColor}
          updatePreview={updatePreview}
          globalState={globalState}
        />
        <div id="generator-content">
          {previewSettings ? previewSettings : null}
          {children}
        </div>
      </div>
    );
  }
}

export default GeneratorContent;