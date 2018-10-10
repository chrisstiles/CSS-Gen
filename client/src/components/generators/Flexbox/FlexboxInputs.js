import React from 'react';
import _ from 'underscore';

class FlexboxInputs extends React.Component {
  constructor(props) {
    super(props);

    this.addChildElement = this.addChildElement.bind(this);
  }

  addChildElement() {
    const child = { id: _.uniqueId('child-') };
    const childElements = this.props.childElements.slice();
    childElements.push(child);
    
    this.props.updateGenerator({ childElements });
  }

  render() {
    const { currentChild } = this.props;

    return (
      <div>
        <div 
          className="button"
          onClick={this.addChildElement}
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