const { registerHandler, loginHandler, postPredictHandler, getPredictHistoriesHandler } = require('../server/handler');
 
const routes = [
  {
    path: '/register',
    method: 'POST',
    handler: registerHandler
  },
  {
    path: '/login',
    method: 'POST',
    handler: loginHandler
  },
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistoriesHandler
  }
]
 
module.exports = routes;