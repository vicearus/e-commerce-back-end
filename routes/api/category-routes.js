const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// finds all categories and associated Products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value with associated Product
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne(req.params.id, { include: [Product] });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  }
  catch (err) {
    res.status(500).json(err)
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(category);
  }
  catch (err) {
    res.status(500).json(err)
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.destroy({ where: { id: req.params.id } });
    res.status(200).json(category);
  }
  catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
