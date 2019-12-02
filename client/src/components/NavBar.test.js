import React from 'react';
import { shallow, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

configure({ adapter: new Adapter() });

describe('Navbar component', () => {
  it('should render correctly', () => {
    const component = shallow(<MemoryRouter><NavBar userName="Guest" /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
});
