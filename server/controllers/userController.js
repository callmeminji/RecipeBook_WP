const User = require('../models/User');

// 로그인한 사용자 프로필 조회
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      profileImage: 'https://example.com/default-profile.jpg', // 고정 URL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};
