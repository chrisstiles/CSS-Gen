import React from 'react';

class Preset extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.styles);
  }

  render() {
    return (
      <div
        className="preset"
        onClick={this.handleClick}
      >
        <div
          className="thumbnail"
          style={this.props.thumbnailStyles}
        />
      </div>
    );
  }
}

export default Preset;