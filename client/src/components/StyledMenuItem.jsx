import styled from 'styled-components';

export const StyledMenuItem = styled.div`
  background: ${(props) => (props.index) === 0 ? '#FCE3FF' : '#D3F4FF' };
  border-radius: 35px;
  margin: 5% 15%;
  padding: 2% 3%;
  color: #888888;
  box-shadow: 0px 3px 3px #cccccc;
`;

export const ItemTitle = styled.h1`
  color: ${(props) => (props.index) === 0 ? '#FF3EF7' : '#007BD4' };
  width: 50%;
  margin: 0%;
  font-size: 30px;
  font-weight: bold;
`;

export const StarWrapper = styled.div`
  font-size: 30px;
  float: right;
`;
