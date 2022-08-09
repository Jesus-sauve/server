const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const theologieThemeySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 50
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TheologieTheme', theologieThemeySchema);


