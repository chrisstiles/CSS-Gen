import React from 'react';
import ContainerInputs from './ContainerInputs';
import ItemInputs from './ItemInputs';
import _ from 'underscore';

class FlexboxInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleContainerChange = this.handleContainerChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.removeChild = this.removeChild.bind(this);
  }

  handleContainerChange(value, name) {
    const containerStyles = _.extend({}, this.props.containerStyles);
    containerStyles[name] = value;

    this.props.updateGenerator({ containerStyles });
  }

  handleItemChange(value, name) {
    const itemStyles = _.extend({}, this.props.itemStyles);
    itemStyles[name] = value;

    this.props.updateGenerator({ itemStyles });
  }

  removeChild() {
    var childElements = this.props.childElements.slice();

    if (childElements.length > 1) {
      childElements.splice(this.props.selectedIndex, 1);
      this.props.updateGenerator({ childElements, selectedIndex: null });
    }
  }

  render() {
    const { currentChild, containerStyles, itemStyles } = this.props;

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
        <ItemInputs
          onChange={this.handleItemChange}
          {...itemStyles}
        />
        {currentChild ? 
          <div>
            <div
              className="button"
              onClick={this.removeChild}
            >
              Remove Child
            </div>
          </div>
        : null}
      </div>
    );
  }
}

export default FlexboxInputs;