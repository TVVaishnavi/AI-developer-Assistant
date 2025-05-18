const admin = require('firebase-admin');
const User = require('../models/user'); 
const { generateToken } = require('../config/jwtToken'); // Assuming this is your custom JWT generator

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')), // ✅ Use actual path
  });
}

const googleLoginService = async (idToken) => {
  try {
    // ✅ This verifies Firebase ID token issued on the frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;

    // Optionally check if user exists in your DB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, google: true }); // adjust fields as needed
    }

    // ✅ Generate your own app token
    const token = generateToken(user._id); // or `{ email }` depending on how your JWT works

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
