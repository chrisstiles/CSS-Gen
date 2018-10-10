import React from 'react';
import ButtonSelect from '../../input/ButtonSelect';
import _ from 'underscore';

class FlexboxInputs extends React.Component {
  constructor(props) {
    super(props);

    this.addChildElement = this.addChildElement.bind(this);
    this.handleContainerChange = this.handleContainerChange.bind(this);
  }

  addChildElement() {
    const child = { id: _.uniqueId('child-') };
    const childElements = this.props.childElements.slice();
    childElements.push(child);
    
    this.props.updateGenerator({ childElements });
  }

  handleContainerChange(value, name) {
    const containerStyles = _.extend({}, this.props.containerStyles);
    containerStyles[name] = value;

    this.props.updateGenerator({ containerStyles });
  }

  render() {
    const { currentChild, containerStyles } = this.props;
    const { flexDirection } = containerStyles;

    return (
      <div>
        <div className="section-title">Container Settings</div>
        <ButtonSelect
          label="Flex Direction"
          name="flexDirection"
          className="half"
          options={[
            { value: 'row', label: 'Row' },
            { value: 'column', label: 'Column' },
            { value: 'row-reverse', label: 'Row Reverse' },
            { value: 'column-reverse', label: 'Column Reverse' }
          ]}
          value={flexDirection}
          onChange={this.handleContainerChange}
        />
        <div 
          className="button"
          onClick={this.addChildElement}
        >
          Add child element
        </div>
        <div className="divider" />
        <div className="section-title">Child Settings</div>
        {currentChild ? 
          <div>
            Selected: {currentChild.id}
          </div>
        : null}
      </div>
    );
  }
}

export default FlexboxInputs;