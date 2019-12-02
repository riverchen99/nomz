import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import AllMenuspage from './AllMenuspage';

configure({ adapter: new Adapter() });

describe('AllMenuspage component', () => {
  it('should render correctly', () => {
    const component = shallow(<MemoryRouter><AllMenuspage /></MemoryRouter>);
    expect(component).toMatchSnapshot();
  });
});
