const TheologieTheme = require('../models/theologieTheme');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const TheologieSousTheme = require('../models/theologieSousTheme');
const Theologie = require('../models/theologie');

exports.create = (req, res) => {
    TheologieTheme.findOne({ name: req.body.name }).exec((err, theologieTheme) => {
        if (theologieTheme) {
            return res.status(400).json({
                error: 'Ce thème déjà existante'
            });
        }
    const { name } = req.body;
    const slug = slugify(name).toLowerCase().replace('\'', '-');

    let newTheologieTheme = new TheologieTheme({ name, slug });

    newTheologieTheme.save((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
});
};

exports.list = (req, res) => {
    TheologieTheme.find({}).exec((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.show = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    TheologieTheme.findOne({ slug })
    .select('_id name slug')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    TheologieTheme.findOne({ slug }).exec((err, theologieTheme) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        TheologieSousTheme.find({ theologieTheme })
        .populate('theologieTheme')
        .select('-theologieTheme')
        // .select('_id name slug theologieTheme')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({theologieTheme: data});
        });
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    TheologieTheme.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Thème supprimé'
        });
    });
};