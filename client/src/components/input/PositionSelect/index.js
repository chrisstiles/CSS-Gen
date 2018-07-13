import React from 'react';

class Position extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.position);
  }

  render() {
    var className = `position ${this.props.position}`;

    return (
      <div 
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}

const locations = ['center', 'top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];

class PositionSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const positions = locations.map(location => {
      return <Position key={location} position={location} />;
    });

    return (
      <div className="position-select">
        {positions}
      </div>
    );
  }
}

export default PositionSelect;