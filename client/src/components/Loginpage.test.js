import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import Loginpage from './Loginpage';

configure({ adapter: new Adapter() });

describe('Login page component', () => {
  it('should render correctly', () => {
    const component = shallow(<MemoryRouter><Loginpage /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
  // this test is only valid for mvp stage since auth isn't final
  it('has correct Link path to recommendations', () => {
    const component = mount(<MemoryRouter><Loginpage /></MemoryRouter>);
    expect(component.find('Link').props().to).toEqual('/recommend');
    expect(component.find('Link')).toMatchSnapshot();
  });
});
