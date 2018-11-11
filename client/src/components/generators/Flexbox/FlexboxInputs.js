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
    const { currentChild, containerStyles, itemStyles: _itemStyles, childElements } = this.props;

    var itemStyles;
    if (currentChild) {
      itemStyles = _.extend({}, _itemStyles, currentChild);
    } else {
      itemStyles = _itemStyles;
    }

    const addButtonClassNames = ['button', 'w100', 'small'];
    const removeButtonClassNames = addButtonClassNames.slice();

    if (childElements.length > 1) {
      removeButtonClassNames.push('red');
    } else {
      removeButtonClassNames.push('disabled');
    }

    addButtonClassNames.push('add-item');
    removeButtonClassNames.push('remove-item');

    return (
      <div>
        <div className="container-settings">
          <div className="section-title">Container Settings</div>
          <ContainerInputs
            onChange={this.handleContainerChange}
            {...containerStyles}
          />
        </div>
        <div className="divider" />
        <div className="item-settings">
          <div
            className={addButtonClassNames.join(' ')}
            onClick={this.props.addChildElement}
          >
            Add flex item
          </div>
          {currentChild ?
            <div>
              <div className="section-title">Selected Item Settings</div>
              <div className="section-info">
                <p>Affects only the selected child element. Press escape to deselect.</p>
              </div>
              <ItemInputs
                onChange={this.handleSingleItemChange}
                {...itemStyles}
              />
              <div
                className={removeButtonClassNames.join(' ')}
                onClick={this.removeChild}
              >
                Remove Child
            </div>
            </div>
            :
            <div>
              <div className="section-title">Shared Item Settings</div>
              <div className="section-info">
                <p>Affects all child elements. You can change modify a specific item by selecting it.</p>
              </div>
              <ItemInputs
                onChange={this.handleAllItemsChange}
                {...itemStyles}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default FlexboxInputs;