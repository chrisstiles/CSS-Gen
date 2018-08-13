import React from 'react';

class Preset extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { generatorStyles, previewStyles } = this.props;
    this.props.setPreset(generatorStyles, previewStyles);
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