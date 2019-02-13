import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';
import BottomContent from './BottomContent';
import LoadingSpinner from './LoadingSpinner';
import _ from 'underscore';

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
          if (
            !_.isEqual(this.prevGeneratorState, this.props.generatorState) ||
            !_.isEqual(this.prevPreviewState, this.props.previewState) ||
            !_.isEqual(this.prevGlobalState, this.props.globalState)
          ) {
            this.prevGeneratorState = this.props.generatorState;
            this.prevPreviewState = this.props.previewState;
            this.prevGlobalState = this.props.globalState;

            const path = window.location.pathname;
            const state = { 
              generatorState: this.prevGeneratorState, 
              previewState: this.prevPreviewState 
            };

            state.timestamp = new Date().getTime();

            // Store in localStorage if there is enough space
            try {
              window.localStorage.setItem(path, JSON.stringify(state));
              loggedLocalStorageError = false;
            } catch (e) {
              if (e.code === 22 && !loggedLocalStorageError) {
                loggedLocalStorageError = true;
                localStorage.clear();
                console.log('Data not persisted, exceeds localStorage quota. Clearing...');
              }
            }
          }
        }
      }, 400);
    }
  }

  componentDidMount() {
    if (this.props.onWrapperMount) {
      this.props.onWrapperMount(this.generatorWrapper);
    }
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
      persistGeneratorState,
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
            <Sidebar generatorState={generatorState}>
              {this.props.renderInputs()}
            </Sidebar>
            <BottomContent 
              renderPreviewSettings={this.renderPreviewSettings}
              renderPresets={this.renderPresets}
              renderOutput={renderOutput}
              outputCode={generatorState.css.output}
              outputPreviewStyles={outputPreviewStyles}
              persistGeneratorState={persistGeneratorState}
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