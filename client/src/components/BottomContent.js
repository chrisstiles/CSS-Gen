import React from 'react';
import Settings from './Settings';
import CodeOutput from './CodeOutput';
import { isArray } from 'underscore';

class BottomContent extends React.Component {
  render() {
    let { output, children } = this.props;

    if (!isArray(output)) {
      output = [output];
    }

    output = output.map(({ language, code }) => {
      return (
        <CodeOutput
          key={language}
          language={language}
          code={code}
         />
      );
    });

    const outputWrapperProps = {
      id: 'generator-output'
    };

    if (output.length > 1) {
      outputWrapperProps.className = 'multiple';
    }

    return (
      <div id="bottom-content-wrapper">
        <div id="bottom-content">
          <div id="options">
            <Settings>
              Preview Settings Here
            </Settings>
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

// class BottomContent extends React.Component {
//   render() {
//     const { 
//       outputCode, 
//       outputPreviewStyles, 
//       previewCSS, 
//       hasBrowserPrefixes, 
//       showBrowserPrefixes,
//       multipleOutputs,
//       renderPreviewSettings,
//       persistGeneratorState,
//       renderPresets,
//       renderOutput
//     } = this.props;

    // const outputWrapperProps = {
    //   id: 'generator-output'
    // };

//     if (multipleOutputs) {
//       outputWrapperProps.className = 'multiple';
//     }
    
//     const output = renderOutput ? renderOutput(previewCSS) : (
      // <CodeOutput
      //   language="css"
      //   outputCode={outputCode}
      //   outputPreviewStyles={outputPreviewStyles}
      //   previewCSS={previewCSS}
      //   hasBrowserPrefixes={hasBrowserPrefixes}
      //   showBrowserPrefixes={showBrowserPrefixes}
      // />
//     );

//     return (
//       <div id="bottom-content-wrapper">
//         <div id="bottom-content">
//           <div id="options">
//             <Settings persistGeneratorState={persistGeneratorState}>
//               {renderPreviewSettings()}
//             </Settings>
//             {renderPresets()}
//           </div>
//           <footer id="main-footer">
//             Footer content goes here
//           </footer>
//         </div>
//         <div {...outputWrapperProps}>
//           {output}
//         </div>
//       </div>
//     );
//   }
// }

export default BottomContent;