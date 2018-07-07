import React from 'react'
import ColorStop from './ColorStop'
import { getColorString } from '../../../util/helpers';

class ColorStopsHolder extends React.Component {
  constructor (props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  handleMouseDown (e) {
    e.preventDefault()
    if (e.button) return
    const pos = e.clientX - e.target.getBoundingClientRect().left
    this.props.onAddColor({ pos, pointX: e.clientX })
  }

  render () {
    const { width, stops, onAddColor, color, ...rest } = this.props
    const style = { width, height: 17, position: 'relative', cursor: 'crosshair' }
    return (
      <div className="csh" style={ style } onMouseDown={ this.handleMouseDown }>
        { stops.map(stop =>
          <ColorStop 
            key={stop.id} 
            stop={ stop } 
            color={getColorString(color)} 
            {...rest} />
        )}
      </div>
    )
  }
}


export default ColorStopsHolder
