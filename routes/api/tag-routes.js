const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: [Product] });
    res.status(200).json(tags)
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// find a single tag by its `id` with associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product,
        through: ProductTag
      },
      ],
    }
    );
    res.json(tag)
    //   include: [{
    //     model: Product,
    //     through: ProductTag
    //   }]
    // });
    // res.status(200).json(tag)
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(tag)
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.destroy({ where: { id: req.params.id } });
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);

  }
});

module.exports = router;
