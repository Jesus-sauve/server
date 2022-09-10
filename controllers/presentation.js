const Presentation = require('../models/presentation');
const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Impossible de charger l'image"
            });
        }

        const { title, body } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: "Titre de la présentation requis"
            });
        }

        if (!body || body.length < 10) { 
            return res.status(400).json({
                error: 'Contenu de la présentation trop court'
            });
        }

        let presentation = new Presentation();
        presentation.title = title;
        presentation.body = body;
        presentation.slug = slugify(title).toLowerCase().replace('\'', '-');

        presentation.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            } else {
                res.json(result);
            }
        });
    });
};

exports.list = (req, res) => {
    Presentation.find()
    .select('_id title slug body')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.show = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Presentation.findOne({ slug })
    .select('_id title slug body')
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

    Presentation.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Suppression réussit'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Presentation.findOne({ slug }).exec((err, oldPresentation) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: "Impossible de charger l'image"
                });
            }

            const { title, body } = fields;

            let slugBeforeMerge = oldPresentation.slug;
            oldPresentation = _.merge(oldPresentation, fields);
            oldPresentation.slug = slugBeforeMerge;

            if (title) {
                oldPresentation.title = title;
                oldPresentation.slug = slugify(title).toLowerCase().replace('\'', '-');
            }

            oldPresentation.save((err, result) => {
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

