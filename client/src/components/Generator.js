import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import _ from 'underscore';

class Generator extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      keys: '',
      outputCSS: ''
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.renderPresets = this.renderPresets.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);

    var loggedLocalStorageError = false;

    // Persist generator state to local storage
    this.persistState = _.debounce(newProps => {
      if (window.localStorage) {
        const path = window.location.pathname;
        const { generatorState, previewState } = newProps;
        const state = { generatorState, previewState }

        // Store in localStorage if there is enough space
        try {
          window.localStorage.setItem(path, JSON.stringify(state));
          loggedLocalStorageError = false;
        } catch(e) {
          if (e.code === 22 && !loggedLocalStorageError) {
            loggedLocalStorageError = true;
            console.log('Data not persisted, exceeds localStorage quota');
          }
        }
      }
    }, 300);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
    document.addEventListener('keyup', this.handleKeyup, false);
    document.addEventListener('keydown', this.props.handleKeydown, false);
    document.addEventListener('keyup', this.props.handleKeyup, false);

    if (this.props.onWrapperMount) {
      this.props.onWrapperMount(this.generatorWrapper);
    }
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeydown, false);
    document.removeEventListener('keyup', this.handleKeyup, false);
    document.removeEventListener('keydown', this.props.handleKeydown, false);
    document.removeEventListener('keyup', this.props.handleKeyup, false);
  }

  componentWillReceiveProps(newProps) {
    // Save state to local storage
    this.persistState(newProps);
  }

  handleKeydown(event) {
    // Adds classes to the generator for common keys pressed
    var keys = [];

    // Shift key
    if (event.shiftKey) {
      keys.push('key-shift');
    }

    // Command or control keys
    if (event.metaKey || event.ctrlKey) {
      keys.push('key-meta');
    }

    // Alt or option keys
    if (event.altKey) {
      keys.push('key-alt');
    }

    const keyString = keys.length ? ` ${keys.join(' ')}` : '';
    this.setState({ keys:  keyString});
  }

  handleKeyup(event) {
    this.setState({ keys: '' });
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
    const cssClasses = `${this.props.className}${this.state.keys}`;

    var hasLoaded = true;
    var previewCSS = '';
    
    if (this.props.previewState) {
      const { previewContentLoaded, previewCSS: styles } = this.props.previewState;
      previewCSS = styles;

      if (previewContentLoaded === undefined) {
        hasLoaded = true;
      } else {
        hasLoaded = previewContentLoaded
      }
    }

    return (
      <Page
        title={this.props.title}
        heading={this.props.heading}
        intro={this.props.intro}
        toolbar={this.renderToolbar()}
      >
        <div 
          id="generator-wrapper"
          className={cssClasses}
        >
          <div 
            id="generator" 
            className="page-content"
            ref={generatorWrapper => { this.generatorWrapper = generatorWrapper }}
          >
            {!hasLoaded ?
              <div id="generator-loading">
                <LoadingSpinner />
              </div>
            : null}
            {this.props.renderPreview()}
            <Sidebar
              outputCSS={this.props.generatorState.css.output}
              outputPreviewStyles={this.props.outputPreviewStyles}
              showBrowserPrefixes={this.props.showBrowserPrefixes}
              previewCSS={previewCSS}
              hasBrowserPrefixes={this.props.hasBrowserPrefixes}
            >
              {this.props.renderInputs()}
            </Sidebar>
            {this.renderPresets()}
          </div>
        </div>
      </Page>
    );
  }
}

export default Generator;