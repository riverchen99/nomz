import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import EditableStarRating from './EditableStarRating';

configure({ adapter: new Adapter() });

const clickFn = jest.fn();
describe('Editable star rating component', () => {
  it('should render correctly with no props', () => {
    const component = shallow(<EditableStarRating />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly with multiple props', () => {
    const component = mount(<EditableStarRating value={1} onStarClick={clickFn} />);
    expect(component.props().value).toEqual(1);
  });
  it('calls the onStarClick function correctly', () => {
    const component = mount(<EditableStarRating value={0} onStarClick={clickFn} />);
    component.props().onStarClick();
    expect(clickFn).toHaveBeenCalled();
  });
});
