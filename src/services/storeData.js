const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function storeUserData(uid, data) {
  const db = new Firestore();

  const userCollection = db.collection('users');
  return userCollection.doc(uid).set(data);
}

module.exports = { storeData, storeUserData };
