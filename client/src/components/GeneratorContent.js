import React from 'react';
import CodeOutput from './CodeOutput';
import { isArray } from 'underscore';

class GeneratorContent extends React.PureComponent {
  render() {
    let { output, children } = this.props;
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
      <div id="generator-content">
        <div {...outputWrapperProps}>
          {codeViewers}
        </div>
        {children}
      </div>
    );
  }
}

export default GeneratorContent;