const { googleLoginService } = require('../service/google');

const googleLoginController = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ status: false, message: 'Missing Google ID token' });
    }

    const { token, name, email } = await googleLoginService(idToken);

    res.status(200).json({
      status: true,
      token,
      email,
      message: 'Google login successful',
    });
  } catch (error) {
    console.error('Google login failed:', error.message);
    res.status(401).json({ status: false, message: 'Google authentication failed' });
  }
};

module.exports = {
  googleLoginController,
};
