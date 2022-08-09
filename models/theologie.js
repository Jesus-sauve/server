const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const theologieSchema = new mongoose.Schema(
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
            min: 50,
            max: 200000000
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        theologieSousThemes: [{ type: ObjectId, ref: 'TheologieSousTheme', required: true }],
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('Theologie', theologieSchema);