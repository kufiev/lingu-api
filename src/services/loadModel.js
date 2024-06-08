const tf = require('@tensorflow/tfjs-node');
 
async function loadModel() {
  // eslint-disable-next-line no-undef
  return tf.loadGraphModel(process.env.MODEL_URL);
}
 
module.exports = loadModel;
