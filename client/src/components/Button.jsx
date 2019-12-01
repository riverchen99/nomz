import React from 'react';
import { StyledButton } from './StyledButton';

function Button(props) {
  const { text, color, handleClick, width } = props;
  return (
    <StyledButton color={color} onClick={handleClick} width={width}>{text}</StyledButton>
  );
}

export default Button;
