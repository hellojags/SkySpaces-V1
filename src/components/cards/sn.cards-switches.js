import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class SnCardsSwitches extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedSwitches: []
    }
  }

  onChange=(evt)=>{
    const swtName = evt.target.name;
    const isChecked = evt.target.checked;
    const { selectedSwitches } = this.state;
    const indexOfSwt = selectedSwitches.indexOf(swtName);
    if (isChecked && indexOfSwt===-1){
      selectedSwitches.push(swtName)
    } else if (!isChecked && indexOfSwt>-1){
      selectedSwitches.splice(indexOfSwt, 1);
    }
    this.setState({
      selectedSwitches
    });
    this.props.onChange(selectedSwitches);
  }

  render() {
    return (
      <FormGroup row className="cards-switch-container">
        <FormControlLabel
          control={
            <Switch name="swtPublic" 
              onChange={this.onChange}
            />
          }
          label="Public Content"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch name="swtSkyspace" 
              onChange={this.onChange} 
            />
          }
          label="SkySpaces"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch name="swtHistory" 
              onChange={this.onChange}
            />
          }
          label="History"
          labelPlacement="start"
        />
      </FormGroup>
    );
  }
}

export default SnCardsSwitches;
