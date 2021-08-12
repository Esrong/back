const Product = require('./../models/product');


exports.get_some = (req, res, next) => {
  const pgSz = +req.query.ps; // page size (products per page)
  const pgNo = +req.query.pg; // page number (current page)

  let srch = req.query.search; // search string

  srch = srch ? `.*${req.query.search}.*` : '';

  let products;

  const productQuery = srch ? Product.find({ name: {$regex: srch} }) : Product.find(); 

  if (pgSz && pgNo) {
    productQuery.skip(pgSz * (pgNo - 1)).limit(pgSz);
  }

  productQuery.find()
    .then((documents) => {
      products = documents;
      return Product.estimatedDocumentCount();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Products fetched.',
        products: products,
        total: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fecthing products failed!'
      });
    });
};