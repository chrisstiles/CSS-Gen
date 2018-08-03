import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';
import _ from 'underscore';
import tinycolor from 'tinycolor2';

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
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
    document.addEventListener('keyup', this.handleKeyup, false);
    document.addEventListener('keydown', this.props.handleKeydown, false);
    document.addEventListener('keyup', this.props.handleKeyup, false);

    // Add saved state from user's previous session if it exists
    // if (window.localStorage) {
    //   const path = window.location.pathname;

    //   if (window.localStorage.hasOwnProperty(path)) {
    //     // console.log('componentDidMount')
    //     var previousState = window.localStorage.getItem(path);

    //     try {
    //       previousState = JSON.parse(previousState);

    //       // console.log(previousState)
    //       const defaultState = this.props.generator.state;
    //       const state = _.extend({}, defaultState, previousState, { localStorage: true });

    //       console.log(state)
    //       // console.log(state)
    //       this.props.generator.setState(state);

    //       window.color = previousState.palette;
    //     } catch(e) {
    //       console.log(e);
    //     }
    //   }
    // }

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
    // console.log('componentWillReceiveProps')
    // Save current state in user's browser
    if (window.localStorage) {
      const path = window.location.pathname;
      const styles = newProps.styles;

      // Save generator styles
      console.log(styles)
      window.localStorage.setItem(path, JSON.stringify(styles));

      // Save preview styles
      // const previewKey = `${path}_preview`;
      // const previewStyles = _.extend({}, newProps.preview.state);

      // console.log(newProps.preview.state)
      // // const previewState = this.preview.
      // // console.log(newProps)
      // var test = {
      //   a: 1,
      //   b: 2
      // }

      // var test2 = _.extend({}, test);

      // console.log(test2)
      // var test3 = {
      //   a: 4,
      //   g: 6,
      //   d: 8
      // }
      // _.extendOwn(test2, test3);

      // console.log(test2)
    }
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

  render() {
    const cssClasses = `${this.props.className}${this.state.keys}`;

    return (
      <Page
        title={this.props.title}
        heading={this.props.heading}
        intro={this.props.intro}
        toolbar={this.props.renderToolbar()}
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
            {this.props.renderPreview()}
            <Sidebar
              outputCSS={this.props.generateCSS().outputCSS}
              outputPreviewStyles={this.props.outputPreviewStyles}
              previewCSS={this.props.previewCSS}
              browserPrefixes={this.props.browserPrefixes}
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