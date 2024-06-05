const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
const ClientError = require('../exceptions/ClientError');
const { register, login } = require('../services/authService');
const InputError = require('../exceptions/InputError');
const Joi = require('joi');
 
/* --------------------------------Need models--------------------------------

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  if (image.length > 1048576) {
    const response = h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000'
    });
    response.code(413);
    return response;
  }
 
  try {
    const { confidenceScore, label, explanation, } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      explanation: explanation,
      createdAt: createdAt
    };

    await storeData(id, data);
    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
    response.code(400);
    return response;
  }
}

async function getPredictHistoriesHandler(request, h) {
  try {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection.get();

    const histories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          explanation: data.explanation,
          id: doc.id
        }
      });
    });

    const response = h.response({
      status: 'success',
      data: histories
    });
    response.code(200);
    return response;
  } catch (error) {
    throw new ClientError('Gagal mengambil riwayat prediksi', 500);
  }
}
*/
async function registerHandler(request, h) {
  const { email, password } = request.payload;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate({ email, password });
  if (error) {
    return h.response({
      status: 'fail',
      message: error.details[0].message
    }).code(400);
  }

  try {
    const user = await register(email, password);
    return h.response({
      status: 'success',
      message: 'User registered successfully',
      data: { uid: user.uid, email: user.email }
    }).code(201);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: err.message
    }).code(400);
  }
}

async function loginHandler(request, h) {
  const { email, password } = request.payload;

  const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
  });

  const { error } = schema.validate({ email, password });
  if (error) {
      return h.response({
          status: 'fail',
          message: error.details[0].message
      }).code(400);
  }

  try {
      const user = await login(email, password);
      return h.response({
          status: 'success',
          message: 'User logged in successfully',
          data: user
      }).code(200);
  } catch (err) {
      return h.response({
          status: 'fail',
          message: err.message
      }).code(400);
  }
}

 
module.exports = { 
  postPredictHandler, 
  getPredictHistoriesHandler, 
  registerHandler,
  loginHandler
};