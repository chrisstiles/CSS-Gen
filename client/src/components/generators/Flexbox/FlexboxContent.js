import React from 'react';
import GeneratorContent from '../../GeneratorContent';
import Preview from '../../Preview';
import Toolbar from '../../Toolbar';
import Toggle from '../../input/Toggle';

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
  handleClick = () => {
    this.props.onClick(this.props.id);
  }

  handleMouseDown = () => {
    if (this.props.onMouseDown) this.props.onMouseDown();
  }

  render() {
    const { className, selected, style, text } = this.props;
    const classes = ['item'];

    if (className) classes.push(className);
    if (selected) classes.push('selected');
    
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
    
    let isEscapeKey, isLink, isMouseEvent, isFlexItem, isSidebar;
    
    isEscapeKey = event.key === 'Escape';

    if (!isEscapeKey) {
      isMouseEvent = event.type === 'click' || event.type === 'mousedown';

      if (isMouseEvent) {
        // Don't deselect while user navigates away from page
        isLink = event.target.tagName === 'A';
        if (isLink) return;

        isFlexItem = event.target.classList.contains('item');
        isSidebar = sameOrChild(event.target, '#sidebar');
      }
    }

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
      shouldChildNumber,
      selectedIndexes
    } = this.props;

    const items = childElements.map(({ id, ...props }, index) => {
      const selected = contains(selectedIndexes, index);
      const style = extend({}, itemStyles, props);
      const text = shouldChildNumber ? (
        <div className="item-content">
          <span>Item:</span>
          {index + 1}
        </div>
      ) : null;

      return (
        <FlexItem
          key={id}
          id={id}
          selected={selected}
          style={style}
          text={text}
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
          <div className="title">Container</div>
          <div className="items-wrapper" style={containerStyles}>
            {items}
          </div>
        </div>
      </div>
    );
  }
}

const FlexboxContent = props => {
  const {
    children,
    isFullHeight,
    showAddButton,
    shouldChildNumber,
    canvasColor,
    output,
    globalState,
    resetGenerator,
    updatePreview,
    ...previewProps
  } = props;

  return (
    <GeneratorContent
      output={output}
      canvasColor={canvasColor}
      globalState={globalState}
      updatePreview={updatePreview}
    >
      {children}
      <Toolbar resetGenerator={resetGenerator}>
        <Toggle
          name="showAddButton"
          label="Add Button"
          onChange={updatePreview}
          checked={showAddButton}
          inline={true}
        />
        <Toggle
          name="isFullHeight"
          label="Full Height"
          onChange={updatePreview}
          checked={isFullHeight}
          inline={true}
        />
        <Toggle
          name="shouldChildNumber"
          label="Child Number"
          onChange={updatePreview}
          checked={shouldChildNumber}
          inline={true}
        />
      </Toolbar>
      <Preview canvasColor={canvasColor}>
        <FlexboxPreviewContent
          isFullHeight={isFullHeight}
          showAddButton={showAddButton}
          shouldChildNumber={shouldChildNumber}
          {...previewProps}
        />
      </Preview>
    </GeneratorContent>
  );
}

export default FlexboxContent;