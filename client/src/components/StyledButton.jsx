import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 100px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0);
  border: 2px solid ${props => props.color};
  border-radius: 50px;
  font-size: 14px;
  color: ${props => props.color};
  font-weight: bold;
`;
