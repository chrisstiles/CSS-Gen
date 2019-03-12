import React from 'react';
import CodeOutput from './CodeOutput';
import { isArray } from 'underscore';

class GeneratorOutput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isFixed: false };
    this.isFixed = false;
  }

  componentDidMount() {
    this.positionWrapper();
    window.addEventListener('scroll', this.positionWrapper, true);
    window.addEventListener('resize', this.positionWrapper, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.positionWrapper);
    window.removeEventListener('resize', this.positionWrapper);
  }

  positionWrapper = () => {
    if (window.pageYOffset >= this.wrapper.parentElement.offsetTop) {
      if (!this.isFixed) {
        this.wrapper.classList.add('fixed');
        this.isFixed = true;
      }
    } else {
      if (this.isFixed) {
        this.wrapper.classList.remove('fixed');
        this.isFixed = false;
      }
    }
  }

  render() {
    let { output } = this.props;
    if (!isArray(output)) output = [output];

    const codeViewers = output.map(({ language, code }) => {
      return (
        <CodeOutput
          key={language}
          language={language}
          code={code}
        />
      );
    });

    const outputWrapperProps = { id: 'generator-output', className: [] };
    if (output.length > 1) outputWrapperProps.className.push('multiple');
    if (this.isFixed) outputWrapperProps.className.push('fixed');
    outputWrapperProps.className = outputWrapperProps.className.join(' ');

    return (
      <div 
        ref={wrapper => { this.wrapper = wrapper }}
        {...outputWrapperProps}
      >
        {codeViewers}
      </div>
    );
  }
}

class GeneratorContent extends React.PureComponent {
  render() {
    return (
      <div id="generator-content">
        <GeneratorOutput output={this.props.output} />
        {this.props.children}
      </div>
    );
  }
}

export default GeneratorContent;