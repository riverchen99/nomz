import styled from 'styled-components';

export const StyledNavBar = styled.div`
  margin: 2%;
  display: flex;
  justify-content: space-between;
  z-index: 0;
`;

export const LogoContainer = styled.div`
  width: 5%;
  height: 3%;
`;

export const LogoImage = styled.img`
  margin-top: 1%;
  width: 70%;
  height: 50%;
`;

export const User = styled.p`
  width: 100%;
  height: 100%;
  text-align: right;
  float: right;
  font-weight: 800;
  color: #888888;
`;

export const HamburgerImage = styled.img`
  width: 3%;
  height: 3%;
  margin-top: 1%;
  margin-left: 5%;
`;

export const Menu = styled.div`
  display: ${props => (props.expanded) ? 'block' : 'none' };
  position: absolute;
  height: 18%;
  width: 10%;
  top: 10%;
  right: 2%;
  background-color: white;
  border-bottom: 1px solid #888888;
  border-left: 1px solid #888888;
  border-right: 1px solid #888888;
  z-index: 2;
`;

export const Wrapper = styled.div`
  // height: 1%;
`;

export const Item = styled.div`
  width: 95%;
  height: 21.5%;
  border-top: 1px solid #888888;
  font-size: 1em;
  color: #888888;
  padding-left: 5%;
  padding-top: 3%;
  :hover {
    background-color: #FCE3FF;
  }
`;
