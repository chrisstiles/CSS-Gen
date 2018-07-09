import React from 'react'
import ColorStop from './ColorStop'

class ColorStopsHolder extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      dragging: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleMouseDown (e) {
    e.preventDefault()
    if (e.button) return
    const pos = e.clientX - e.target.getBoundingClientRect().left
    this.props.onAddColor({ pos, pointX: e.clientX })
  }

  handleDrag(dragging) {
    this.setState({ dragging });
  }

  render () {
    var className = 'csh';

    if (this.state.dragging) {
      className += ' dragging';
    }

    const { width, stops, onAddColor, color, ...rest } = this.props
    const style = { width, height: 17, position: 'relative', cursor: 'crosshair' }
    return (
      <div 
        className={className} 
        style={style} 
        onMouseDown={this.handleMouseDown}
      >
        { stops.map(stop =>
          <ColorStop 
            key={stop.id} 
            stop={stop}
            onDrag={this.handleDrag}
            {...rest} 
          />
        )}
      </div>
    )
  }
}


export default ColorStopsHolder
