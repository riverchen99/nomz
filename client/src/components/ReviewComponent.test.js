import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import ReviewComponent from './ReviewComponent';

configure({ adapter: new Adapter() });

describe('Displaying review component', () => {
  it('should render correctly without props', () => {
    const component = shallow(<ReviewComponent />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly with given review prop', () => {
    const component = mount(<ReviewComponent review="5dcd9dada8d15f5897b49edb" />);
    expect(component.props().review).toEqual('5dcd9dada8d15f5897b49edb');
  });
});
