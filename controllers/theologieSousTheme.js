const TheologieSousTheme = require('../models/theologieSousTheme');
const Theologie = require('../models/theologie');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.create = (req, res) => {
        

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { name, theologieTheme } = fields;

        if (!name || !name.length) {
            return res.status(400).json({
                error: 'Merci de vérifier les champs'
            });
        }

        if (!theologieTheme || theologieTheme.length === 0) {
            return res.status(400).json({
                error: 'Merci de cocher un thème'
            });
        }

        let theologieSousTheme = new TheologieSousTheme();
        theologieSousTheme.name = name;
        theologieSousTheme.slug = slugify(name).toLowerCase().replace('\'', '-');
        let arrayOfTheologieTheme = theologieTheme && theologieTheme.split(',');

        theologieSousTheme.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            TheologieSousTheme.findByIdAndUpdate(result._id, { $push: { theologieTheme: arrayOfTheologieTheme } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        res.json(result)
                    }
                }
            );
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    TheologieSousTheme.findOne({ slug }).exec((err, oldTheologieSousTheme) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {

            const { name, theologieTheme } = fields;

            let slugBeforeMerge = oldTheologieSousTheme.slug;
            oldTheologieSousTheme = _.merge(oldTheologieSousTheme, fields);
            oldTheologieSousTheme.slug = slugBeforeMerge;

            if (name) {
                oldTheologieSousTheme.name = name;
                oldTheologieSousTheme.slug = slugify(name).toLowerCase().replace('\'', '-');
            }

            if (theologieTheme) {
                oldTheologieSousTheme.theologieTheme = theologieTheme.split(',');
            }

            oldTheologieSousTheme.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                res.json(result);
            });
        });
    });
};


exports.list = (req, res) => {
    TheologieSousTheme.find({}).exec((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    TheologieSousTheme.findOne({ slug }).exec((err, theologieSousThemes) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Theologie.find({ theologieSousThemes })
        .populate('theologieSousThemes')
        .select('-theologieSousThemes')
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({ theologies: data })
        })
    });
};

exports.show = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    TheologieSousTheme.findOne({ slug })
    .populate('theologieTheme', '_id name slug')
    .select('_id name slug theologieTheme')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    TheologieSousTheme.findOneAndRemove({ slug }).exec((err, data) => {
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