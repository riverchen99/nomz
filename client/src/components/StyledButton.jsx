import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const StyledButton = styled.button`
  width: 125px;
  height: 35px;
  background-color: white;
  border: 2px solid ${props => props.color};
  border-radius: 50px;
  font-size: 18px;
  color: ${props => props.color};
  font-weight: bold;
`;
