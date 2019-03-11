import React from 'react';
import CodeOutput from './CodeOutput';
import { isArray } from 'underscore';

class GeneratorOutput extends React.PureComponent {
  calculateScrollPoints = () => {
    if (!this.wrapper) return;

    
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

    const outputWrapperProps = { id: 'generator-output' };
    if (output.length > 1) outputWrapperProps.className = 'multiple';

    return (
      <div 
        ref={wrapper => { this.wrapper = wrapper }}
        {...outputWrapperProps}
      >
        {codeViewers}
      </div>
    );
  }
}

class GeneratorContent extends React.PureComponent {
  render() {
    return (
      <div id="generator-content">
        <GeneratorOutput output={this.props.output} />
        {this.props.children}
      </div>
    );
  }
}

export default GeneratorContent;