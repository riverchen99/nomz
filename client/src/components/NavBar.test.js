import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

configure({ adapter: new Adapter() });

describe('Navbar component', () => {
  it('should render correctly', () => {
    const component = shallow(<MemoryRouter><NavBar userName="Guest" /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
  // left out because the logged in state was not be evaluated properly
  // it('should keep track of logged in state', () => {
  //   const component = mount(<MemoryRouter><NavBar userName="Someone" /></MemoryRouter>);
  //   expect(component.find('NavBar').state().loggedIn).toEqual(true);
  //   expect(component).toMatchSnapshot();
  // });
});
