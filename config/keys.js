module.exports = {
  mongoURI: 'mongodb+srv://nomz:nomz@nomz-iusx7.mongodb.net/nomz_db?retryWrites=true&w=majority',
  mongoTestURI: 'mongodb+srv://nomz:nomz@nomz-iusx7.mongodb.net/nomz_test?retryWrites=true&w=majority',
  facebook_api_key: '2623061141304048',
  facebook_api_secret: '60cde255a2815e7942df2bd52a007352',
  facebook_callback_url: process.env.NODE_ENV === 'production'
    ? 'https://cs130-nomz.herokuapp.com/auth/facebook/callback'
    : '/auth/facebook/callback',
};
