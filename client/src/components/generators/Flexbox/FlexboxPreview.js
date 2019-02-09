import React from 'react';
import _ from 'underscore';
import { sameOrChild, getGlobalVariable } from '../../../util/helpers';

class FlexItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.id);
  }

  handleMouseDown() {
    if (this.props.onMouseDown) {
      this.props.onMouseDown();
    }
  }

  render() {
    const { className, selected, style, text } = this.props;
    const classes = ['item'];

    if (className) {
      classes.push(className);
    }

    if (selected) {
      classes.push('selected');
    }
    
    return (
      <div
        className={classes.join(' ')}
        style={style}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
      >
        {text}
      </div>
    );
  }
}

class FlexboxPreview extends React.Component {
  constructor(props) {
    super(props);

    if (props.selectedIndexes.length) {
      if (props.selectedIndexes[props.mostRecentIndex] === undefined) {
        this.mostRecentIndex = Math.max.apply(null, props.selectedIndexes);
      } else {
        this.mostRecentIndex = props.mostRecentIndex;
      }
    }

    this.selectChildElements = this.selectChildElements.bind(this);
    this.deselectChildElement = this.deselectChildElement.bind(this);
    this.preventDeselect = this.preventDeselect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.deselectChildElement);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.deselectChildElement);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (event.metaKey || event.ctrlKey) {
      this.key = 'meta';

      // Select all boxes
      if (event.key === 'a' && !getGlobalVariable('outputIsFocused')) {
        if (this.props.childElements.length) {
          event.preventDefault();

          const selectedIndexes = [];
          _.each(this.props.childElements, (element, index) => {
            selectedIndexes.push(index);
          });

          this.props.updateGenerator({ selectedIndexes });
        }
      }
    } else if (event.shiftKey) {
      this.key = 'shift';
    }
  }

  handleKeyUp(event) {
    this.deselectChildElement(event);
    this.key = null;
  }

  preventDeselect() {
    this.canDeselect = false;
  }

  deselectChildElement(event) {
    if (!this.props.selectedIndexes.length || !this.canDeselect) {
      this.canDeselect = true;
      return;
    }
    
    const isEscapeKey = event.key === 'Escape';
    const isClick = event.type === 'click';
    const isFlexItem = event.target.classList.contains('item');
    const isSidebar = sameOrChild(event.target, '#sidebar');

    if (isEscapeKey || (isClick && !isFlexItem && !isSidebar)) {
      this.props.updateGenerator({ selectedIndexes: [] });
    }
  }

  selectChildElements(id) {
    const { childElements, selectedIndexes: _selectedIndexes } = this.props;
    const newIndex = _.findIndex(childElements, { id });
    var selectedIndexes;

    if (typeof this.mostRecentIndex !== 'number' || childElements[this.mostRecentIndex] === undefined) {
      this.mostRecentIndex = childElements[childElements.length - 1];
    }

    // Select multiple values
    if (_selectedIndexes.length && (this.key === 'meta' || this.key === 'shift')) {
      selectedIndexes = _selectedIndexes.slice();
      const alreadySelected = _.contains(selectedIndexes, newIndex);

      if (this.key === 'meta') {
        if (alreadySelected) {
          // Deselect item if meta key is pressed and 
          // previously selected item is clicked
          const i = selectedIndexes.indexOf(newIndex);
          selectedIndexes.splice(i, 1);
        } else {
          selectedIndexes.push(newIndex);
          this.mostRecentIndex = newIndex;
        }
      } else if (this.key === 'shift') {
        var startIndex, endIndex;
        if (newIndex > this.mostRecentIndex) {
          startIndex = this.mostRecentIndex;
          endIndex = newIndex;
        } else if (newIndex < this.mostRecentIndex) {
          startIndex = newIndex;
          endIndex = this.mostRecentIndex;
        } else {
          if (newIndex > selectedIndexes[0]) {
            startIndex = selectedIndexes[0];
            endIndex = newIndex;
          } else {
            startIndex = newIndex;
            endIndex = selectedIndexes[0];
          }
        }

        selectedIndexes = [];
        for (var i = startIndex; i <= endIndex; i++) {
          selectedIndexes.push(i);
        }
      }
      
    } else {
      this.mostRecentIndex = newIndex;
      selectedIndexes = [newIndex];
    }

    this.props.updateGenerator({ selectedIndexes, mostRecentIndex: this.mostRecentIndex });
  }

  render() {
    const { 
      showAddItemButton, 
      fullHeightContainer,
      containerBackgroundColor,
      addChildElement, 
      containerStyles, 
      canAddChildElement,
      itemStyles: _itemStyles,
      childElements: _childElements,
      selectedIndexes
    } = this.props;

    const childElements = _.map(_childElements, ({ id, ...props }, index) => {
      const selected = _.contains(selectedIndexes, index);
      const itemStyles = _.extend({}, _itemStyles, props);

      return (
        <FlexItem
          key={id}
          id={id}
          selected={selected}
          style={itemStyles}
          text={<div style={{ color: '#fff', padding: '8px' }}>{index}</div>}
          onClick={this.selectChildElements}
          onMouseDown={this.preventDeselect}
        />
      );
    });

    // Final flex item for adding new child element 
    if (showAddItemButton) {
      const newItemText = (
        <div>
          <span className="plus"></span>
          <div>Add Item</div>
        </div>
      );

      const addButtonClasses = ['new-item'];

      if (!canAddChildElement) {
        addButtonClasses.push('disabled');
      }

      childElements.push(
        <FlexItem
          key="add-item"
          className={addButtonClasses.join(' ')}
          text={newItemText}
          style={_itemStyles}
          onClick={addChildElement}
        />
      );
    }

    const containerClassName = ['container'];

    if (fullHeightContainer) {
      containerClassName.push('full-height');
    }

    // Handle container background color
    containerStyles.backgroundColor = containerBackgroundColor;

    if (containerBackgroundColor !== 'transparent') {
      containerClassName.push('has-background');
    }

    return (
      <div 
        id="flexbox-preview"
      >
        <div 
          className={containerClassName.join(' ')}
          style={containerStyles}
        >
          {childElements}
        </div>
      </div>
    );
  }
}

export default FlexboxPreview;