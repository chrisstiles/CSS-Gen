import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';

class Generator extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      keys: '',
      outputCSS: ''
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
    document.addEventListener('keyup', this.handleKeyup, false);
    document.addEventListener('keydown', this.props.handleKeydown, false);
    document.addEventListener('keyup', this.props.handleKeyup, false);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeydown, false);
    document.removeEventListener('keyup', this.handleKeyup, false);
    document.removeEventListener('keydown', this.props.handleKeydown, false);
    document.removeEventListener('keyup', this.props.handleKeyup, false);
  }

  componentWillMount() {
    this.setState({ outputCSS: this.props.generateCSS() });
  }

  componentWillReceiveProps() {
    this.setState({ outputCSS: this.props.generateCSS() });
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

  render() {
    const cssClasses = `${this.props.className}${this.state.keys}`;

    return (
      <Page
        title={this.props.title}
        heading={this.props.heading}
        toolbar={this.props.renderToolbar()}
      >
        <div 
          id="generator-wrapper"
          className={cssClasses}
        >
          <div 
            id="generator" 
            className="page-content"

          >
            {this.props.renderPreview()}
            <Sidebar
              property={this.props.property}
              outputCSS={this.state.outputCSS}
              outputPreviewStyles={this.props.outputPreviewStyles}
              previewCSS={this.props.previewCSS}
              browserPrefixes={this.props.browserPrefixes}
            >
              {this.props.renderInputs()}
            </Sidebar>
            {this.props.children}
          </div>
        </div>
      </Page>
    );
  }
}

export default Generator;