import React from 'react';
import ContainerInputs from './ContainerInputs';
import ItemInputs from './ItemInputs';
import _ from 'underscore';

class FlexboxInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleContainerChange = this.handleContainerChange.bind(this);
    this.handleAllItemsChange = this.handleAllItemsChange.bind(this);
    this.handleSingleItemChange = this.handleSingleItemChange.bind(this);
    this.removeChild = this.removeChild.bind(this);
  }

  handleContainerChange(value, name) {
    const { containerStyles: _containerStyles, updateGenerator } = this.props;
    const containerStyles = _.extend({}, _containerStyles);
    containerStyles[name] = value;

    updateGenerator({ containerStyles });
  }

  handleAllItemsChange(value, name) {
    const { itemStyles: _itemStyles, updateGenerator } = this.props;
    const itemStyles = _.extend({}, _itemStyles);
    itemStyles[name] = value;

    updateGenerator({ itemStyles });
  }

  handleSingleItemChange(value, name) {
    const { childElements: _childElements, itemStyles, selectedIndex, updateGenerator } = this.props;

    if (selectedIndex === null || 
        itemStyles[name] === undefined || 
        !_childElements[selectedIndex] ||
        typeof itemStyles[name] !== typeof value) {
      return;
    }

    const childElements = _childElements.slice();
    childElements[selectedIndex][name] = value;
    
    updateGenerator({ childElements });
  }

  removeChild() {
    const { childElements: _childElements, selectedIndex, updateGenerator } = this.props;
    var childElements = _childElements.slice();

    if (childElements.length > 1) {
      childElements.splice(selectedIndex, 1);
      updateGenerator({ childElements, selectedIndex: null });
    }
  }

  render() {
    const { currentChild, containerStyles, itemStyles: _itemStyles } = this.props;

    var itemStyles;
    if (currentChild) {
      itemStyles = _.extend({}, _itemStyles, currentChild);
    } else {
      itemStyles = _itemStyles;
    }

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
            <div className="section-title">Affects just selected child</div>
            <ItemInputs
              onChange={this.handleSingleItemChange}
              {...itemStyles}
            />
            <div
              className="button"
              onClick={this.removeChild}
            >
              Remove Child
            </div>
          </div>
        :
          <div>
            <div className="section-title">Affects all children</div>
            <ItemInputs
              onChange={this.handleAllItemsChange}
              {...itemStyles}
            />
          </div>
        }
      </div>
    );
  }
}

export default FlexboxInputs;