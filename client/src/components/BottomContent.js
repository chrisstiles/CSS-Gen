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
      renderPresets
    } = this.props;

    return (
      <div id="bottom-content-wrapper">
        <div id="bottom-content">
          {renderPresets()}
          
          <footer id="main-footer">
            Footer content goes here
          </footer>
        </div>
        <div id="generator-output">
          {renderOutput ?
            renderOutput(previewCSS)
            :
            <CodeOutput
              language="css"
              outputCode={outputCode}
              outputPreviewStyles={outputPreviewStyles}
              previewCSS={previewCSS}
              hasBrowserPrefixes={hasBrowserPrefixes}
              showBrowserPrefixes={showBrowserPrefixes}
            />
          }
        </div>
      </div>
    );
  }
}

export default BottomContent;