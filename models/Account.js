const mongoose = require('mongoose');

const AccountScheme = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('Account', AccountScheme);