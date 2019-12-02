import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import AllMenuspage from './AllMenuspage';

configure({ adapter: new Adapter() });

describe('AllMenuspage component', () => {
  it('should render correctly', () => {
    const component = shallow(<MemoryRouter><AllMenuspage /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
  // it('should keep track of logged in state', () => {
  //   const component = mount(<MemoryRouter><NavBar userName={"Someone" } /></MemoryRouter>);
  //   expect(component.find('NavBar').state().loggedIn).toEqual(true);
  //   expect(component).toMatchSnapshot();
  //   });
});
