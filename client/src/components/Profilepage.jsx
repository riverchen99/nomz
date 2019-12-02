import React from 'react';
import Button from './Button';
import NavBar from './NavBar';
import {
  FilterContainer,
  Header,
  ButtonContainer,
} from './StyledRecommendpage';
import axios from 'axios';
import Select from 'react-select';

class Recommendpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedIn: false,
      user: null,
      restrictions: [],
      preferences: []
    };
    this.preferences = []
    this.restrictions = []
  }

  async componentDidMount() {
    let authRes = await axios.get('/auth/user');
    if (!!authRes.data.user) {
        this.setState({
          loggedIn: true,
          user: authRes.data.user
        })

        let userRes = await axios.get("/api/users/"+authRes.data.user._id);
        this.setState({
          preferences: userRes.data[0].preferences,
          restrictions: userRes.data[0].restrictions
        })
        console.log("componentDidMount")

    }
  }

  renderDropdowns() {
    const dropDownOptions = [{value: "none", label: "No preference"}, {value: "preference", label: "Preference (include)"}, {value: "restriction", label: "Restriction (exclude)"}];
    const props = [
      { display: "Vegetarian", schemaValue: "vegetarian" },
      { display: "Vegan", schemaValue: "vegan" },
      { display: "Contains Peanuts", schemaValue: "peanuts" },
      { display: "Contains Tree Nuts", schemaValue: "treeNuts" },
      { display: "Contains Wheat", schemaValue: "wheat" },
      { display: "Contains Gluten", schemaValue: "gluten" },
      { display: "Contains Soy", schemaValue: "soy" },
      { display: "Contains Dairy", schemaValue: "dairy" },
      { display: "Contains Eggs", schemaValue: "eggs" },
      { display: "Contains Crustacean Shellfish", schemaValue: "shellfish" },
      { display: "Contains Fish", schemaValue: "fish" },
      { display: "Halal", schemaValue: "Halal" },
      { display: "Low Carbon Footprint", schemaValue: "lowCarbon" }
    ]

    return props.map(prop => {
      return (
        <tr key={prop.schemaValue}>
          <td>{prop.display}</td> 
          <td>
            <div style={{width: "300px"}}>
              <Select options={dropDownOptions} value={ 
                this.state.preferences.includes(prop.schemaValue) ? dropDownOptions[1] :
                  (this.state.restrictions.includes(prop.schemaValue) ? dropDownOptions[2] : dropDownOptions[0])
              } style={{width: "500"}} onChange={(option) => this.updateProfile(prop, option)} /> 
            </div>
          </td>
        </tr>
      )

    })
  }

  updateProfile(prop, option) {
    let preferences = this.state.preferences.filter((value) => value !== prop.schemaValue)
    let restrictions = this.state.restrictions.filter((value) => value !== prop.schemaValue)

    if (option.value === "preference") {
      preferences.push(prop.schemaValue)
    } else if (option.value === "restriction") {
      restrictions.push(prop.schemaValue)
    }

    this.setState({
      preferences, restrictions
    })
  }

  saveProfile() {
    axios.put("/api/users", {
      filter: {_id: this.state.user},
      update: {preferences: this.state.preferences, restrictions: this.state.restrictions}
    }).then((resp) => { alert("Updated profile!") })
  }

  render () {
        return (
      <React.Fragment>
        <NavBar userName={this.state.loggedIn ? this.state.user.name : "Guest"} />
        <Header>{this.state.loggedIn ? this.state.user.name + "'s Profile" : "Profile"}</Header>

        <FilterContainer>

          <table>
            <tbody>
            {this.renderDropdowns()}
            </tbody>
          </table>

          <ButtonContainer>
            <Button text={"Update"} color={"#EF39FF"} handleClick={() => this.saveProfile()}/>
          </ButtonContainer>
        </FilterContainer>
      </React.Fragment>
    )
  }
}

export default Recommendpage;
