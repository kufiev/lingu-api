const { Firestore } = require('@google-cloud/firestore');
const crypto = require('crypto');
const ClientError = require('../exceptions/ClientError');
const { registerUser, loginUser } = require('../services/authService');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { storeData } = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { label, suggestion, confidenceScore } = request.payload;
  const authHeader = request.headers.authorization || request.state.token;

  if (!authHeader) {
    const response = h.response({
      status: 'fail',
      message: 'Authorization header is missing',
    });
    response.code(401);
    return response;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Invalid token',
    });
    response.code(401);
    return response;
  }

  try {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      confidenceScore: confidenceScore,
      createdAt: createdAt,
      userId: user.uid,
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Data is stored successfully',
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error storing data:', error);
    const response = h.response({
      status: 'fail',
      message: 'Error occurred while storing data',
    });
    response.code(500);
    return response;
  }
}

async function getPredictHistoriesHandler(request, h) {
  const authHeader = request.headers.authorization || request.state.token;

  if (!authHeader) {
    const response = h.response({
      status: 'fail',
      message: 'Authorization header is missing',
    });
    response.code(401);
    return response;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Invalid token',
    });
    response.code(401);
    return response;
  }

  try {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection
      .where('userId', '==', user.uid)
      .get();

    const histories = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
          confidenceScore: data.confidenceScore,
          id: doc.id,
        },
      });
    });

    const response = h.response({
      status: 'success',
      data: histories,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error('Error fetching prediction histories:', error);
    throw new ClientError('Gagal mengambil riwayat prediksi', 500);
  }
}

async function registerHandler(request, h) {
  const { fullName, email, password, confirmPassword } = request.payload;

  const schema = Joi.object({
    fullName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'The password and confirmation password do not match.',
      }),
  });

  const { error } = schema.validate({
    fullName,
    email,
    password,
    confirmPassword,
  });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: error.details[0].message,
      })
      .code(400);
  }

  try {
    const user = await registerUser(email, password, fullName);
    return h
      .response({
        status: 'success',
        message: 'User registered successfully',
        data: {
          uid: user.uid,
          email: user.email,
          fullName: user.fullName,
        },
      })
      .code(201);
  } catch (err) {
    return h
      .response({
        status: 'fail',
        message: err.message,
      })
      .code(400);
  }
}

async function loginHandler(request, h) {
  const { email, password } = request.payload;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: error.details[0].message,
      })
      .code(400);
  }

  try {
    const user = await loginUser(email, password);

    return h
      .response({
        status: 'success',
        message: 'User logged in successfully',
        data: user,
      })
      .state('token', user.token, {
        path: '/',
        isHttpOnly: true,
        isSecure: process.env.NODE_ENV === 'production',
      })
      .code(200);
  } catch (err) {
    return h
      .response({
        status: 'fail',
        message: err.message,
      })
      .code(400);
  }
}

module.exports = {
  postPredictHandler,
  getPredictHistoriesHandler,
  registerHandler,
  loginHandler,
};
