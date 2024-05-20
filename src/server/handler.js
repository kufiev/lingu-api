const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
const ClientError = require('../exceptions/ClientError');
 
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
    const { confidenceScore, label, suggestion, } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
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
    const predictCollection = db.collection('prediction');
    const snapshot = await predictCollection.get();

    const histories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
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
 
module.exports = { postPredictHandler, getPredictHistoriesHandler };