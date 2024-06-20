const {
  registerHandler,
  loginHandler,
  postPredictHandler,
  getProgressHandler,
  getAccountHandler,
} = require('../server/handler');

const routes = [
  {
    path: '/register',
    method: 'POST',
    handler: registerHandler,
  },
  {
    path: '/login',
    method: 'POST',
    handler: loginHandler,
  },
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: ['application/json'],
      },
    },
  },
  {
    path: '/progress',
    method: 'GET',
    handler: getProgressHandler,
  },
];

module.exports = routes;
