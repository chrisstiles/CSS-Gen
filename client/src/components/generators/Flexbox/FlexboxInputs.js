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
    const { childElements: _childElements, itemStyles, selectedIndexes, updateGenerator } = this.props;

    if (!selectedIndexes.length
        || itemStyles[name] === undefined
        || !_childElements[Math.max.apply(null, selectedIndexes)]
        || typeof itemStyles[name] !== typeof value) {
      return;
    }

    const childElements = _childElements.slice();

    _.each(selectedIndexes, index => {
      childElements[index][name] = value;
    });
    
    updateGenerator({ childElements });
  }

  removeChild() {
    const { childElements: _childElements, selectedIndexes, updateGenerator } = this.props;
    
    if (!selectedIndexes.length) {
      return;
    }

    var childElements = [];

    _.each(_childElements, (element, index) => {
      if (!_.contains(selectedIndexes, index)) {
        childElements.push(element);
      }
    });

    updateGenerator({ childElements, selectedIndexes: [] });
  }

  render() {
    const { selectedIndexes, containerStyles, itemStyles: _itemStyles, childElements } = this.props;

    const numSelected = selectedIndexes.length;
    var itemStyles, selectedText, removeText;
    if (numSelected) {
      itemStyles = _.extend({}, _itemStyles, childElements[selectedIndexes[numSelected - 1]]);

      if (numSelected === 1) {
        selectedText = (
          <p>
            <strong>{numSelected} item selected:</strong> Changes only affect this child element. Press escape to deselect
          </p>
        );

        removeText = 'Remove element';
      } else {
        selectedText = (
          <p>
            <strong>{numSelected} items selected:</strong> Changes only affect these child elements. Press escape to deselect
          </p>
        );

        removeText = `Remove ${numSelected} elements`;
      }

    } else {
      itemStyles = _itemStyles;
    }

    const addButtonClassNames = ['button', 'w100', 'small'];
    const removeButtonClassNames = addButtonClassNames.slice();

    addButtonClassNames.push('add-item');
    removeButtonClassNames.push('red', 'remove-item');

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
          {selectedIndexes.length ?
            <div>
              <div className="section-title">Selected Item Settings</div>
              <div className="section-info">
                {selectedText}
              </div>
              <ItemInputs
                onChange={this.handleSingleItemChange}
                {...itemStyles}
              />
              <div
                className={removeButtonClassNames.join(' ')}
                onClick={this.removeChild}
              >
                {removeText}
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