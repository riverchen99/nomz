import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const StyledButton = styled.button`
  width: 100px;
  height: 30px;
  background-color: white;
  border: 2px solid ${props => props.color};
  border-radius: 50px;
  font-size: 14px;
  color: ${props => props.color};
  font-weight: bold;
`;
