import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

const config = require("./config/config");


class App extends Component {
  constructor () {
    super()
    this.state = {}
  }

  handleClick() {
    console.log("Clicked!");
    console.log(config.local_backend)
    axios.get(config.local_backend + "/api/menuitems")
          .then(resp => {console.log(resp.data); this.setState({menuItems: resp.data})});
  }

  render () {
    return (
      <div className='button__container'>
        <button className='button' onClick={this.handleClick.bind(this)}>
          Click Me
        </button>
        <p>menu items: {JSON.stringify(this.state.menuItems)}</p>
      </div>
    )
  }
}

export default App;
