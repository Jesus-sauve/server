const Enseignement = require('../models/enseignement');
const Category = require('../models/category');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/enseignement');

exports.create = (req, res) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Impossible de charger l'image"
            });
        }

        const { title, body, categories } = fields;

            if (!title || !title.length) {
            return res.status(400).json({
                error: "Quel est le titre de l'enseignement ?"
            });
        }

        if (!body || body.length < 50) { 
            return res.status(400).json({
                error: "Contenu de l'enseignement trop court"
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: "Veuillez choisir une catégorie pour l'enseignement"
            });
        }

        let enseignement = new Enseignement();
        enseignement.title = title;
        enseignement.body = body;
        enseignement.excerpt = smartTrim(body, 120, ' ', ' ...');
        enseignement.slug = slugify(title).toLowerCase().replace('\'', '-');
        enseignement.mtitle = `${title} | ${process.env.APP_NAME}`;
        enseignement.mdesc = stripHtml(body.substring(0, 160));

        let arrayOfCategories = categories && categories.split(',');

            if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "L'image ne doit pas dépasser 1 mega"
                });
            }
            enseignement.photo.data = fs.readFileSync(files.photo.path);
            enseignement.photo.contentType = files.photo.type;
        }

            enseignement.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            Enseignement.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true}).exec((err, result) => {
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
    Enseignement.find({})
        .populate('categories', '_id name slug')
        .select('_id title slug excerpt categories createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllEnseignementCategories = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let enseignements;
    let categories;

    Enseignement.find({})
        .populate('categories', '_id name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            enseignements = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories
                    // return all blogs categories
                    res.json({ enseignements, categories, size: enseignements.length });
               
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Enseignement.findOne({ slug })
        // .select("-photo")
        .populate('categories', '_id name slug')
        .select('_id title body slug excerpt categories createdAt updatedAt')
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
    Enseignement.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Enseignement supprimé'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Enseignement.findOne({ slug }).exec((err, oldEnseignement) => {
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

            
            const { body, title, desc, categories } = fields;

            let slugBeforeMerge = oldEnseignement.slug;
            oldEnseignement = _.merge(oldEnseignement, fields);
            oldEnseignement.slug = slugBeforeMerge;

            if (title) {
                oldEnseignement.title = title;
                oldEnseignement.slug = slugify(title).toLowerCase().replace('\'', '-');
            }

            if (body) {
                oldEnseignement.excerpt = smartTrim(body, 120, ' ', ' ...');
                oldEnseignement.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldEnseignement.categories = categories.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: "L'image ne doit pas dépasser 1mega"
                    });
                }
                oldEnseignement.photo.data = fs.readFileSync(files.photo.path);
                oldEnseignement.photo.contentType = files.photo.type;
            }

            oldEnseignement.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Enseignement.findOne({ slug })
        .select('photo')
        .exec((err, enseignement) => {
            if (err || !enseignement) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', enseignement.photo.contentType);
            return res.send(enseignement.photo.data);
        });
};

exports.listRelated = (req, res) => {
    // console.log(req.body.blog);
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.enseignement;

    Enseignement.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .select('title slug excerpt createdAt updatedAt')
        .exec((err, enseignements) => {
            if (err) {
                return res.status(400).json({
                    error: 'Enseignement non trouvé'
                });
            }
            res.json(enseignements);
        });
};


// Search system
exports.listSearch = (req, res) => {
    const {search} = req.query;
    // console.log(req.query);
    if(search) {
        Enseignement.find({
            $or: [{title: {$regex: search, $options: 'i'}}, {body: {$regex: search, $options: 'i'}}]
        }, (err, enseignements) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(enseignements);
        }).select('-photo -body');
    }
};

