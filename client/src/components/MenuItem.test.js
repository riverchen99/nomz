import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import MenuItem from './MenuItem';

configure({ adapter: new Adapter() });

describe('Menu Item component', () => {
  it('should render correctly without props', () => {
    const component = shallow(<MenuItem />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly given props', () => {
    const component = mount(<MemoryRouter><MenuItem itemName="bologna" restaurant="covel" rating={2} index={1} id={22} /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
  it('has correct Link path to menu item review page', () => {
    const component = mount(<MemoryRouter><MenuItem itemName="bologna" restaurant="covel" rating={2} index={1} id={22} /></MemoryRouter>);
    expect(component.find('Link').props().to.pathname).toEqual('/menuitem/bologna');
    expect(component.find('Link')).toMatchSnapshot();
  });
});
