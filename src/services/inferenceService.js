const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

/* --------------------------------Need models--------------------------------

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
        const classes = ['一', '丁', '七'];
 
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
 
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];
 
        let explanation;
 
        if (label === '一') {
            explanation = "lorem."
        }
         
        if (label === '丁') {
            explanation = "lorem."
        }
         
        if (label === '七') {
            explanation = "lorem."
        }
 
        return { confidenceScore, label, explanation };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
*/
 
module.exports = predictClassification;