import React from 'react';
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div>
        <p>{this.props.userName}</p>
      </div>
    )
  }
}