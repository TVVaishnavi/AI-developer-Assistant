const admin = require('firebase-admin');
const User = require('../models/user'); 
const { generateToken } = require('../config/jwtToken'); 


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')), 
  });
}

const googleLoginService = async (idToken) => {
  try {

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, google: true });
    }

    const token = generateToken(user._id); 

    return {
      token,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error('Firebase ID token verification failed');
  }
};

module.exports = {
  googleLoginService,
};
