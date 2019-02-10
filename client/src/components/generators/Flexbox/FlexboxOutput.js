import React from 'react';
import CodeOutput from '../../CodeOutput';

class FlexboxOutput extends React.Component {
  render() {
    const { outputCSS, previewCSS } = this.props;
    const { outputPreviewStyles, showBrowserPrefixes } = this.props.globalState;
    const codeOutputs = [];
    
    codeOutputs.push(
      <CodeOutput
        language="css"
        key="css"
        outputCode={outputCSS}
        outputPreviewStyles={outputPreviewStyles}
        previewCSS={previewCSS}
        hasBrowserPrefixes={true}
        showBrowserPrefixes={showBrowserPrefixes}
      />
    );

    const html = `
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
    `;

    codeOutputs.push(
      <CodeOutput
        language="html"
        key="html"
        outputCode={html}
      />
    );

    return codeOutputs;
  }
}

export default FlexboxOutput;