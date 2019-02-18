import React from 'react';
import Preview from '../../Preview';
import { 
  contains, 
  extend, 
  findIndex 
} from 'underscore';
import { 
  sameOrChild, 
  getGlobalVariable, 
  clearSelection 
} from '../../../util/helpers';

class FlexItem extends React.PureComponent {
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

class FlexboxPreviewContent extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.selectedIndexes.length) {
      if (props.selectedIndexes[props.mostRecentIndex] === undefined) {
        this.mostRecentIndex = Math.max.apply(null, props.selectedIndexes);
      } else {
        this.mostRecentIndex = props.mostRecentIndex;
      }
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.deselectChildElement);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.deselectChildElement);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (event) => {
    if (event.metaKey || event.ctrlKey) {
      this.key = 'meta';

      // Select all boxes
      if (event.key === 'a' && !getGlobalVariable('outputIsFocused')) {
        const { childElements, updateGenerator } = this.props;

        if (childElements.length) {
          event.preventDefault();

          const selectedIndexes = [];
          childElements.forEach((element, index) => {
            selectedIndexes.push(index);
          });

          updateGenerator({ selectedIndexes });
        }
      }
    } else if (event.shiftKey) {
      this.key = 'shift';
    }
  }

  handleKeyUp = (event)  =>{
    this.deselectChildElement(event);
    this.key = null;
  }

  preventDeselect = () => {
    this.canDeselect = false;
  }

  deselectChildElement = (event) => {
    if (!this.props.selectedIndexes.length || !this.canDeselect) {
      this.canDeselect = true;
      return;
    }
    
    const isEscapeKey = event.key === 'Escape';
    const isMouseEvent = event.type === 'click' || event.type === 'mousedown';
    const isFlexItem = event.target.classList.contains('item');
    const isSidebar = sameOrChild(event.target, '#sidebar');

    if (isEscapeKey || (isMouseEvent && !isFlexItem && !isSidebar)) {
      this.props.updateGenerator({ selectedIndexes: [] });
    }
  }

  selectChildElements = (id) => {
    const { childElements, selectedIndexes: _selectedIndexes } = this.props;
    const newIndex = findIndex(childElements, { id });
    let selectedIndexes;

    if (typeof this.mostRecentIndex !== 'number' || childElements[this.mostRecentIndex] === undefined) {
      this.mostRecentIndex = childElements[childElements.length - 1];
    }

    // Select multiple values
    if (_selectedIndexes.length && (this.key === 'meta' || this.key === 'shift')) {
      selectedIndexes = _selectedIndexes.slice();
      const alreadySelected = contains(selectedIndexes, newIndex);

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
        let startIndex, endIndex;
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
        for (let i = startIndex; i <= endIndex; i++) {
          selectedIndexes.push(i);
        }
      }
      
    } else {
      this.mostRecentIndex = newIndex;
      selectedIndexes = [newIndex];
    }

    this.props.updateGenerator({ selectedIndexes, mostRecentIndex: this.mostRecentIndex });

    // Clear any previously selected text
    clearSelection();
  }

  render() {
    const { 
      containerStyles,
      isFullHeight,
      itemStyles,
      showAddButton, 
      addChildElement, 
      canAddChildElement,
      childElements,
      selectedIndexes
    } = this.props;

    const items = childElements.map(({ id, ...props }, index) => {
      const selected = contains(selectedIndexes, index);
      const style = extend({}, itemStyles, props);

      return (
        <FlexItem
          key={id}
          id={id}
          selected={selected}
          style={style}
          text={<div style={{ color: '#fff', padding: '8px' }}>{index}</div>}
          onClick={this.selectChildElements}
          onMouseDown={this.preventDeselect}
        />
      );
    });

    // Final flex item for adding new child element 
    if (showAddButton) {
      const newItemText = (
        <div>
          <span className="plus"></span>
          <div>Add Item</div>
        </div>
      );

      const addButtonClasses = ['new-item'];
      if (!canAddChildElement) addButtonClasses.push('disabled');

      items.push(
        <FlexItem
          key="add-item"
          className={addButtonClasses.join(' ')}
          text={newItemText}
          style={itemStyles}
          onClick={addChildElement}
        />
      );
    }

    // Container Styles
    const containerProps = {
      className: 'container',
      style: extend({}, containerStyles)
    }
    
    if (isFullHeight) containerProps.style.minHeight = '100%';

    return (
      <div id="flexbox-preview">
        <div {...containerProps}>
          {items}
        </div>
      </div>
    );
  }
}

const FlexboxPreview = ({ canvasColor, ...previewProps }) => {
  return (
    <Preview
      disabledCanvasPattern={true}
      canvasColor={canvasColor}
    >
      <FlexboxPreviewContent {...previewProps} />
    </Preview>
  );
}

export default FlexboxPreview;