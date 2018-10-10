import React from 'react';
import _ from 'underscore';

class FlexChild extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    var className = 'child';

    if (this.props.selected) {
      className += ' selected';
    }

    return (
      <div
        className={className}
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
        <FlexChild
          key={id}
          id={id}
          text={id}
          selected={selected}
          onClick={this.handleClick}
        />
      );
    });

    return (
      <div id="flexbox-preview">
        <div className="parent">
          {childElements}
        </div>
      </div>
    );
  }
}

export default FlexboxPreview;