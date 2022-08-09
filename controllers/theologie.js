const Theologie = require('../models/theologie');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/theologie');
const TheologieSousTheme = require('../models/theologieSousTheme');

exports.create = (req, res) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Impossible de charger l'image"
            });
        }

        const { title, body, theologieSousThemes } = fields;

            if (!title || !title.length) {
            return res.status(400).json({
                error: "Merci de mentionner un titre"
            });
        }

        if (!body || body.length < 50) { 
            return res.status(400).json({
                error: "Contenu trop court"
            });
        }

        if (!theologieSousThemes || theologieSousThemes.length === 0) {
            return res.status(400).json({
                error: 'Merci de cocher un thème'
            });
        }

        let theologie = new Theologie();
        theologie.title = title;
        theologie.body = body;
        theologie.excerpt = smartTrim(body, 120, ' ', ' ...');
        theologie.slug = slugify(title).toLowerCase().replace('\'', '-');
        theologie.mtitle = `${title} | ${process.env.APP_NAME}`;
        theologie.mdesc = stripHtml(body.substring(0, 160))
        let arrayOfTheologieSousThemes = theologieSousThemes && theologieSousThemes.split(',')

        theologie.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            Theologie.findByIdAndUpdate(result._id, {$push: {theologieSousThemes: arrayOfTheologieSousThemes}}, {new: true}).exec((err, result) => {
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    res.json(result)
                }

            })

        })
    })

};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
    Theologie.find({})
        .populate('theologieSousThemes', '_id name slug')
        .select('_id title slug excerpt body theologieSousThemes createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listTheologie = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let theologie;

    Theologie.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            theologie = data; 
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Theologie.findOne({ slug })
        // .select("-photo")
        .populate('theologieSousThemes', '_id name slug')
        .select('_id title body slug excerpt theologieSousThemes createdAt updatedAt')
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
    Theologie.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'suppression réussit'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Theologie.findOne({ slug }).exec((err, oldTheologie) => {
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
            const { title, body, desc, theologieSousThemes } = fields;

            
            let slugBeforeMerge = oldTheologie.slug;
            oldTheologie = _.merge(oldTheologie, fields);
            oldTheologie.slug = slugBeforeMerge;
            
            if (title) {
                oldTheologie.title = title;
                oldTheologie.slug = slugify(title).toLowerCase().replace('\'', '-');
            }

            if (body) {
                oldTheologie.excerpt = smartTrim(body, 120, ' ', ' ...');
                oldTheologie.desc = stripHtml(body.substring(0, 160));
            }

            if (theologieSousThemes) {
                oldTheologie.theologieSousThemes = theologieSousThemes.split(',');
            }

            oldTheologie.save((err, result) => {
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

