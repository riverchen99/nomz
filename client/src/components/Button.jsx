import React from 'react';
import { StyledButton } from './StyledButton';

function Button(props) {
  const { text, color } = props;
  return (
    <StyledButton color={color}>{text}</StyledButton>
  )
}

export default Button;