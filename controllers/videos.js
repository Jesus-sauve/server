const Videos = require('../models/videos');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/videos');

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
                error: "Merci de donner un titre à cette vidéo"
            });
        }

        if (!body || body.length < 10) { 
            return res.status(400).json({
                error: "Contenu de l'enseignement trop court"
            });
        }

        let videos = new Videos();
        videos.title = title;
        videos.body = body;
        videos.excerpt = smartTrim(body, 120, ' ', ' ...');
        videos.slug = slugify(title).toLowerCase();
        videos.mtitle = `${title} | ${process.env.APP_NAME}`;
        videos.mdesc = stripHtml(body.substring(0, 160));

 

        videos.save((err, result) => {
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
    Videos.find({})
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

exports.listVideos = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let videos;

    Videos.find({})
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
            videos = data; 
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Videos.findOne({ slug })
        // .select("-photo")
        .select('_id title body slug excerpt createdAt updatedAt')
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
    Videos.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Vidéo supprimée'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Videos.findOne({ slug }).exec((err, oldVideo) => {
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

            let slugBeforeMerge = oldVideo.slug;
            oldVideo = _.merge(oldVideo, fields);
            oldVideo.slug = slugBeforeMerge;

            const { body, desc } = fields;

            if (body) {
                oldVideo.excerpt = smartTrim(body, 120, ' ', ' ...');
                oldVideo.desc = stripHtml(body.substring(0, 160));
            }

            oldVideo.save((err, result) => {
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


// Search system
exports.listSearch = (req, res) => {
    const {search} = req.query;
    // console.log(req.query);
    if(search) {
        Videos.find({
            $or: [{title: {$regex: search, $options: 'i'}}, {body: {$regex: search, $options: 'i'}}]
        }, (err, videos) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(videos);
        }).select('-body');
    }
};

