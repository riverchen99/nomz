import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import Recommendpage from './Recommendpage';

configure({ adapter: new Adapter() });

describe('Recommendations page component', () => {
  it('should render correctly without props', () => {
    const component = shallow(<Recommendpage />);
    expect(component).toMatchSnapshot();
  });
  it('componentDidMount is called', () => {
    const component = mount(<MemoryRouter><Recommendpage /></MemoryRouter>);
    expect(component.find('Recommendpage').state().mounted).toEqual(true);
  });
});

describe('Select components and Recommendations page state', () => {
  it('day select has correct initial value', () => {
    const component = mount(<MemoryRouter><Recommendpage /></MemoryRouter>);
    expect(component.find('Select#daysel').props().value.value).toEqual('today');
  });
  it('day select updates parent state', () => {
    const component = mount(<MemoryRouter><Recommendpage /></MemoryRouter>);
    component.find('Select#daysel').prop('onChange')({ value: 'today', label: 'Today' });
    expect(component.find('Recommendpage').state().day).toEqual('today');
    component.find('Select#daysel').prop('onChange')({ value: 'tomorrow', label: 'Tomorrow' });
    expect(component.find('Recommendpage').state().day).toEqual('tomorrow');
  });
  it('recommendee select has correct initial value', () => {
    const component = mount(<MemoryRouter><Recommendpage /></MemoryRouter>);
    expect(component.find('Select#recsel').props().value.value).toEqual('everyone');
  });
  it('recommendee select updates parent state', () => {
    const component = mount(<MemoryRouter><Recommendpage /></MemoryRouter>);
    component.find('Select#recsel').prop('onChange')({ value: 'everyone', label: 'Everyone' });
    expect(component.find('Recommendpage').state().recommendee).toEqual('everyone');
    component.find('Select#recsel').prop('onChange')({ value: 'me', label: 'Me' });
    expect(component.find('Recommendpage').state().recommendee).toEqual('me');
  });
});
