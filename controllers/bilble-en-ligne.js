const Bible = require('../models/bible');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/bible');

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
                error: "Merci de mentionner un titre"
            });
        }

        if (!body || body.length < 50) { 
            return res.status(400).json({
                error: "Contenu trop court"
            });
        }

        let bible = new Bible();
        bible.title = title;
        bible.body = body;
        bible.excerpt = smartTrim(body, 120, ' ', ' ...');
        bible.slug = slugify(title).toLowerCase();
        bible.mtitle = `${title} | ${process.env.APP_NAME}`;
        bible.mdesc = stripHtml(body.substring(0, 160));

 

        bible.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);

        })
    })

};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
    Bible.find({})
        .select('_id title slug excerpt createdAt updatedAt')
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
    Bible.findOneAndRemove({ slug }).exec((err, data) => {
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
