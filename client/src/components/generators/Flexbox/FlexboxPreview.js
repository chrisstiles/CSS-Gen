import React from 'react';
import _ from 'underscore';
import { sameOrChild } from '../../../util/helpers';

class FlexItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    const { className, selected, style } = this.props;
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
      >
        {this.props.text}
      </div>
    );
  }
}

class FlexboxPreview extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.deselectChildElement = this.deselectChildElement.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.deselectChildElement);
    document.addEventListener('keyup', this.deselectChildElement);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.deselectChildElement);
    document.addEventListener('keyup', this.deselectChildElement);
  }

  deselectChildElement(event) {
    if (this.props.selectedIndex === null) {
      return;
    }
    
    const isEscapeKey = event.key === 'Escape';
    const isClick = event.type === 'click';
    const isFlexItem = event.target.classList.contains('item');
    const isSidebar = sameOrChild(event.target, '#sidebar');

    if (isEscapeKey || (isClick && !isFlexItem && !isSidebar)) {
      this.props.updateGenerator({ selectedIndex: null });
    }
  }

  handleClick(id) {
    const { childElements } = this.props;
    const selectedIndex = _.findIndex(childElements, { id });
    
    this.props.updateGenerator({ selectedIndex });
  }

  render() {
    const { 
      showAddItemButton, 
      addChildElement, 
      containerStyles, 
      containerBackgroundColor: backgroundColor,
      itemStyles: _itemStyles,
      childElements: _childElements
    } = this.props;

    const childElements = _.map(_childElements, ({ id, ...props }, index) => {
      const selected = this.props.selectedIndex === index ? true : false;
      const itemStyles = _.extend({}, _itemStyles, props);

      return (
        <FlexItem
          key={id}
          id={id}
          selected={selected}
          style={itemStyles}
          onClick={this.handleClick}
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

      childElements.push(
        <FlexItem
          key="add-item"
          className="new-item"
          text={newItemText}
          style={_itemStyles}
          onClick={addChildElement}
        />
      );
    }

    return (
      <div 
        id="flexbox-preview"
        style={{ backgroundColor }}
      >
        <div 
          className="container"
          style={containerStyles}
        >
          {childElements}
        </div>
      </div>
    );
  }
}

export default FlexboxPreview;