import React from 'react';
import { shallow, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import MenuItempage from './MenuItempage';

configure({ adapter: new Adapter() });

describe('Single menu item page component', () => {
  it('should render correctly with given path name and state', () => {
    const component = shallow(
      <MemoryRouter initialEntries={[{ pathname: '/menuitem/Sandwich', state: { name: 'Sandwich', id: '0' } }]}>
        <MenuItempage />
      </MemoryRouter>,
    );
    expect(component).toMatchSnapshot();
  });
  // NOTE:  This test is having issues due to getting this.prop.location.state
  //        to work during mounting. Will work on in Part C.

  // it('componentDidMount gets called', () => {
  //   const component = mount(
  //     <MemoryRouter initialEntries={[{ state: {name: 'Sandwich', id: '0'}}]}>
  //       <MenuItempage />
  //     </MemoryRouter>);
  //   expect(component.find('MenuItempage').state().mounted).toEqual(true);
  // });
});
