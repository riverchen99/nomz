# Front End Test Cases

*Note:* 
We put our test cases for our frontend components in the components folder due to our tests not being able to run if they were in their own folder, and also because it is recommended that you keep your tests in the same directory as your components.

### Button.test.js

Since the button is stateless, we use snapshot testing to ensure the UI is consistent with changes. However, it does take props so a test ensures it receives props correctly and renders. The third test checks its onClick handler function using a Jest mock function to ensure the function is called correctly when a Button is clicked.

### Loginpage.test.js

The Loginpage is also stateless so it uses a snapshot to ensure the UI is consistent with code changes. It contains a link from react-router to redirect the user to the recommendations dashboard, so we test that the Link component has correct props and matches the snapshot as well.

### MenuItem.test.js

The MenuItem has a snapshot test with shallow rendering to ensure the UI is consistent with code changes. Its props are also tested so that we know they have the correct values  when passed. Similar to the Loginpage, we have a test for its Link to verify it will route the user properly. 

### Recommendpage.test.js

Recommendation has state, so it will be tested more thoroughly than previous components. Aside from shallow rendering with snapshot testing and props testing, we want to test its lifecycle method componentDidMount. We mounted the component on the DOM with enzyme and tested that it is mounted correctly since the lifecycle method sets the state variable mounted to true when called. 

A second test suite was used to test the recommendation dropdown components. There are two dropdown, for day and recommend options. For each of the dropdown, we check for correct props passing and that when their onChange handler is called, the Recommendpage component's state is updated properly. This is necessary for us to verify that we are rendering the correct menu items depending on the dropdown values. 

### EditableStarRating.test.js

This component for the editable star rating is stateless, and therefore we just use snapshot testing for UI changes. We test its props, which include the number of stars that are filled in, as well as its onStarClick handler function. The component this implements uses a premade star rating component.

### MenuItempage.test.js

The tests for this component are incomplete due to some issues with not being able to pass in a prop correctly. For this we just simply use a snapshot test for now, and will be updated in Part C when we resolve the issue for testing.

### ReviewComponent.test.js

The ReviewComponent has states which are set internally by the props we pass in. Therefore for this test, we simply use a snapshot test and test that the props properly hold the value passed in.

### ReviewForm.test.js

The ReviewForm test does a snapshot test for simple UI changes and ensures that the handler functions (onReviewSubmit and onReviewChange) work properly when passed in via props.

