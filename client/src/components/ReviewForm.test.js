import React from 'react';
import { shallow, mount, configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import ReviewForm from './ReviewForm';

configure({ adapter: new Adapter() });

const reviewChangeFn = jest.fn();
const submitFn = jest.fn();
describe('Input to submit text review', () => {
  it('should render correctly without props', () => {
    const component = shallow(<ReviewForm />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly with onReviewSubmit and onReviewChange', () => {
    const component = mount(<ReviewForm onReviewSubmit={submitFn} onReviewChange={reviewChangeFn} />);
    expect(component).toMatchSnapshot();
  });
  it('calls the onReviewSubmit function correctly', () => {
    const component = mount(<ReviewForm onReviewSubmit={submitFn} onReviewChange={reviewChangeFn} />);
    component.props().onReviewSubmit();
    expect(submitFn).toHaveBeenCalled();
  });
  it('calls the onReviewChange function correctly', () => {
    const component = mount(<ReviewForm onReviewSubmit={submitFn} onReviewChange={reviewChangeFn} />);
    component.props().onReviewChange();
    expect(reviewChangeFn).toHaveBeenCalled();
  });
});
