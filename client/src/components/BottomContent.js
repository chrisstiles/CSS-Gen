import React from 'react';
import CodeOutput from './CodeOutput';

class BottomContent extends React.Component {
  render() {
    const { 
      outputCode, 
      outputPreviewStyles, 
      previewCSS, 
      hasBrowserPrefixes, 
      showBrowserPrefixes,
      renderOutput,
      multipleOutputs,
      renderPresets
    } = this.props;

    const outputWrapperProps = {
      id: 'generator-output'
    };

    if (multipleOutputs) {
      outputWrapperProps.className = 'multiple';
    }

    const output = renderOutput ? renderOutput(previewCSS) : (
      <CodeOutput
        language="css"
        outputCode={outputCode}
        outputPreviewStyles={outputPreviewStyles}
        previewCSS={previewCSS}
        hasBrowserPrefixes={hasBrowserPrefixes}
        showBrowserPrefixes={showBrowserPrefixes}
      />
    );

    return (
      <div id="bottom-content-wrapper">
        <div id="bottom-content">
          {renderPresets()}
          
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