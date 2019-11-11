import React from 'react';
import { Link } from 'react-router-dom';

class Recommendpage extends React.Component {
  render () {
    return (
      <div>
        <h1>What are you craving?</h1>
        <p><Link to="/menuitem">Click here to view menu item</Link></p>
      </div>
    )
  }
}

export default Recommendpage;
