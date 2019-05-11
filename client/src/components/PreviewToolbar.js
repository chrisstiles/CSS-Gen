import React from 'react';

class PreviewToolbar extends React.PureComponent {
  render() {
    const { children, resetGenerator } = this.props;

    return (
      <div id="preview-toolbar">
        <h3>Preview</h3>
        <div className="content">{children}</div>
        {resetGenerator ?
          <div
            className="button small reset"
            onClick={resetGenerator}
          >
            Reset
          </div>
          : null}
      </div>
    );
  }
}

export default PreviewToolbar;