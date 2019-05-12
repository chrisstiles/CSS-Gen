import React from 'react';
import ColorStop from './ColorStop';

class ColorStopsHolder extends React.Component {
  handleMouseDown = e => {
    e.preventDefault();
    if (e.button) return;
    const pos = e.clientX - e.target.getBoundingClientRect().left;
    this.props.onAddColor({ pos, pointX: e.clientX });
  }

  render() {
    const { width, stops, onAddColor, ...rest } = this.props;
    const style = { width };

    return (
      <div className="csh" style={ style } onMouseDown={ this.handleMouseDown }>
        { stops.map(stop =>
          <ColorStop key={ stop.id } stop={ stop } { ...rest } />
        )}
      </div>
    )
  }
}


export default ColorStopsHolder
