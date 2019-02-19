import React from 'react';
import CodeOutput from './CodeOutput';
import { isArray } from 'underscore';

class BottomContent extends React.PureComponent {
  render() {
    const { children } = this.props;

    let { output } = this.props;
    if (!isArray(output)) output = [output];

    output = output.map(({ language, code }) => {
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
      <div id="bottom-content-wrapper">
        <div id="bottom-content">
          <div id="options">
            {children}
          </div>
          <footer id="main-footer">
            Footer content goes here
          </footer>
        </div>
        <div {...outputWrapperProps}>
          {output}
        </div>
      </div>
    );
  }
}

export default BottomContent;