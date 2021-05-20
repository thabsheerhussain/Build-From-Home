const mongoose = require('mongoose');

const User = new mongoose.Schema({
    
    discordId: {
        type: String,
        required: true
    },
    district: String,
    ageGroup: String,
});

module.exports = mongoose.model("User",User);