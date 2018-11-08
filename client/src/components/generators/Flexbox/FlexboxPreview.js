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
    const { className, selected } = this.props;
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
    document.addEventListener('click', this.deselectChildElement, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.deselectChildElement);
  }

  deselectChildElement(event) {
    if (this.props.selectedIndex === null) {
      return;
    }
    
    const FlexItem = sameOrChild(event.target, '#flexbox-preview');
    const isSidebar = sameOrChild(event.target, '#sidebar');

    if (!FlexItem && !isSidebar) {
      this.props.updateGenerator({ selectedIndex: null });
    }
  }

  handleClick(id) {
    const { childElements } = this.props;
    const selectedIndex = _.findIndex(childElements, { id });
    
    this.props.updateGenerator({ selectedIndex });
  }

  render() {
    const childElements = _.map(this.props.childElements, ({ id, text }, index) => {
      const selected = this.props.selectedIndex === index ? true : false;

      return (
        <FlexItem
          key={id}
          id={id}
          selected={selected}
          onClick={this.handleClick}
        />
      );
    });

    // Final flex item for adding new child element 
    if (this.props.showAddItemButton) {
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
          onClick={this.props.addChildElement}
        />
      );
    }

    return (
      <div id="flexbox-preview">
        <div 
          className="container"
          style={this.props.containerStyles}
        >
          {childElements}
        </div>
      </div>
    );
  }
}

export default FlexboxPreview;