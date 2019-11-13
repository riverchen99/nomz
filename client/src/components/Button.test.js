import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import Button from './Button';

it('should render correctly with no props', () => {
  const component = shallow(<Button />);
  expect(component).toMatchSnapshot();
});

const clickFn = jest.fn();
describe('MyComponent', () => {
  it('button click should hide component', () => {
    const component = shallow(<Button color='#aaaaaa' text="hi" onClick={clickFn} />);
    expect(component.text()).toEqual("hi");
    console.log(component.props().color);
    expect(component.props().color).toEqual('#aaaaaa');
  });
});
