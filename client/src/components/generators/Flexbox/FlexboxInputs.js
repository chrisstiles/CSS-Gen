import React from 'react';
import ContainerInputs from './ContainerInputs';
import _ from 'underscore';

class FlexboxInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleContainerChange = this.handleContainerChange.bind(this);
  }

  handleContainerChange(value, name) {
    const containerStyles = _.extend({}, this.props.containerStyles);
    containerStyles[name] = value;

    this.props.updateGenerator({ containerStyles });
  }

  render() {
    const { currentChild, containerStyles } = this.props;

    return (
      <div>
        <div className="section-title">Container Settings</div>
        <ContainerInputs
          onChange={this.handleContainerChange}
          {...containerStyles}
        />
        <div 
          className="button"
          onClick={this.props.addChildElement}
        >
          Add child element
        </div>
        <div className="divider" />
        <div className="section-title">Child Settings</div>
        {currentChild ? 
          <div>
            Selected: {currentChild.id}
          </div>
        : null}
      </div>
    );
  }
}

export default FlexboxInputs;