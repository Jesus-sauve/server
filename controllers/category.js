const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Enseignement = require('../models/enseignement');

exports.create = (req, res) => {
    Category.findOne({ name: req.body.name }).exec((err, category) => {
        if (category) {
            return res.status(400).json({
                error: 'Catégorie déjà existante'
            });
        }
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    let newCategory = new Category({ name, slug });

    newCategory.save((err, data) => {
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
    Category.find({}).exec((err, data) => {
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

    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Enseignement.find({ categories: category })
        .populate('categories', '_id name slug')
        .select('_id title slug excerpt categories createdAt updatedAt' )
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({ category: category, enseignements: data })
        })
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.sendStatus(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Catégorie supprimée'
        });
    });
};