import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick() {
    axios.get('/api/menuitems')
      .then((resp) => { console.log(resp.data); this.setState({ menuItems: resp.data }); });
  }

  render() {
    const { menuItems } = this.state;
    return (
      <div className="button__container">
        <button type="button" onClick={this.handleClick.bind(this)}>
          Click Me
        </button>
        <p>
          menu items:
          {' '}
          {JSON.stringify(menuItems)}
        </p>
      </div>
    );
  }
}

export default App;
