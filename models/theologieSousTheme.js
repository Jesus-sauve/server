const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const theologieSousThemeSchema = new mongoose.Schema(
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
        theologieTheme: [{ type: ObjectId, ref: 'TheologieTheme', required: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('TheologieSousTheme', theologieSousThemeSchema);


