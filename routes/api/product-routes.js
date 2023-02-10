const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products with Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ include: [Category, Tag] });
    res.status(200).json(products)
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// get one product by id with Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [Category, Tag] });
    res.status(200).json(product)
  }
  catch (err) {
    res.status(500).json(err);
  }
});

/* req.body should look like this...
{
  product_name: "Basketball",
  price: 200.00,
  stock: 3,
  tagIds: [1, 2, 3, 4]
}
*/
// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds)
      
    } else {
    // if no product tags, just respond
    res.status(200).json(product)}
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// update product data
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    const updatedProductTags = await ProductTag.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.status(200).json(updatedProductTags);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json(product)
  }
  catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
