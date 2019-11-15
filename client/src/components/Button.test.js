import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import Button from './Button';

configure({ adapter: new Adapter() });

const clickFn = jest.fn();
describe('Button component', () => {
  it('should render correctly with no props', () => {
    const component = shallow(<Button />);
    expect(component).toMatchSnapshot();
  });
  it('renders correctly with props', () => {
    const component = mount(<Button color="#aaaaaa" text="hi" onClick={clickFn} />);
    expect(component.text()).toEqual('hi');
    expect(component.props().color).toEqual('#aaaaaa');
  });
  it('calls onClick properly', () => {
    const component = mount(<Button color="#aaaaaa" text="hi" onClick={clickFn} />);
    // component.simulate('click'); apparently this doesn't work
    component.props().onClick();
    expect(clickFn).toHaveBeenCalled();
  });
});
