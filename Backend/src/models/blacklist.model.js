const mongoose = require('mongoose');

const blacklistTokenSchema = mongoose.Schema({
    token: {
        type: String,
        requied: [true, "token is required to be added in blacklist"]
    }
}, { timestamps: true }
)

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema);

module.exports = tokenBlacklistModel;