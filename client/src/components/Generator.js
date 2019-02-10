import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';
import BottomContent from './BottomContent';
import LoadingSpinner from './LoadingSpinner';
import { setLoading } from '../util/helpers';

class Generator extends React.Component {
  constructor(props) {
    super(props);

    this.renderPresets = this.renderPresets.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderPreviewSettings = this.renderPreviewSettings.bind(this);

    // Persist generator state to local storage
    let loggedLocalStorageError = false;
    let persistStateTimer;

    this.persistState = () => {
      // Use a timer to prevent this from being called too often
      clearTimeout(persistStateTimer);
      persistStateTimer = setTimeout(() => {
        if (window.localStorage) {
          const path = window.location.pathname;
          const { generatorState, previewState } = this.props;
          const state = { generatorState, previewState }

          // Store in localStorage if there is enough space
          try {
            window.localStorage.setItem(path, JSON.stringify(state));
            loggedLocalStorageError = false;
          } catch (e) {
            if (e.code === 22 && !loggedLocalStorageError) {
              loggedLocalStorageError = true;
              console.log('Data not persisted, exceeds localStorage quota');
            }
          }
        }
      }, 500);
    }
  }

  componentDidMount() {
    if (this.props.onWrapperMount) {
      this.props.onWrapperMount(this.generatorWrapper);
    }

    setLoading(false);
  }

  componentDidUpdate() {
    this.persistState();
  }

  renderPreviewSettings () {
    if (this.props.renderPreviewSettings) {
      return this.props.renderPreviewSettings();
    }
  }

  renderPresets() {
    if (this.props.renderPresets) {
      return this.props.renderPresets(this.props.setPreset);
    }
  }

  renderToolbar() {
    if (this.props.renderToolbar) {
      return this.props.renderToolbar();
    }
  }

  render() {
    const { 
      className = '',
      title, 
      heading, 
      intro, 
      generatorState, 
      hasBrowserPrefixes, 
      previewState = '', 
      multipleOutputs,
      renderOutput 
    } = this.props;
    const { 
      outputPreviewStyles, 
      showBrowserPrefixes, 
      loading 
    } = this.props.globalState;

    return (
      <Page
        title={title}
        heading={heading}
        intro={intro}
        toolbar={this.renderToolbar()}
      >
        <div 
          id="generator-wrapper"
          className={className}
        >
          <div 
            id="generator" 
            className="page-content"
            ref={generatorWrapper => { this.generatorWrapper = generatorWrapper }}
          >
            {loading ?
              <div id="generator-loading">
                <LoadingSpinner />
              </div>
            : null}
            {this.props.renderPreview()}
            <Sidebar>
              {this.props.renderInputs()}
            </Sidebar>
            <BottomContent 
              renderPreviewSettings={this.renderPreviewSettings}
              renderPresets={this.renderPresets}
              renderOutput={renderOutput}
              outputCode={generatorState.css.output}
              outputPreviewStyles={outputPreviewStyles}
              showBrowserPrefixes={showBrowserPrefixes}
              previewCSS={previewState.previewCSS}
              hasBrowserPrefixes={hasBrowserPrefixes}
              multipleOutputs={multipleOutputs}
            />
          </div>
        </div>
      </Page>
    );
  }
}

export default Generator;