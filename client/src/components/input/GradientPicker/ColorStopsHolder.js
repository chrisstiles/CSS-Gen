import React from 'react';
import ColorStop from './ColorStop';
import { getEventPosition } from '../../../util/helpers';

class ColorStopsHolder extends React.Component {
  handleMouseDown = e => {
    e.preventDefault();
    if (e.button) return;
    const { x } = getEventPosition(e);
    if (!x) return;

    const pos = x - e.target.getBoundingClientRect().left;
    this.props.onAddColor({ pos, pointX: x });
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
