const User = require('../models/User');

const calculateLeaderboard = async () => {
    try {
        return await User.find()
            .sort({ totalXP: -1 })
            .limit(10)
            .select('username totalXP');
    } catch (error) {
        throw new Error('Error calculating leaderboard');
    }
};

module.exports = {
    calculateLeaderboard
}; 