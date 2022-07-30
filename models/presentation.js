const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        body: {
            type: {},
            required: true,
            min: 10,
            max: 2000000
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Presentation', presentationSchema);