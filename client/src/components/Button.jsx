import React from 'react';
import { StyledButton } from './StyledButton';

function Button(props) {
  const { text, color, handleClick } = props;
  return (
    <StyledButton color={color} onClick={handleClick}>{text}</StyledButton>
  )
}

export default Button;
