const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/product.controller');
const { auth, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

router.get('/', productController.getAllProducts);
router.get('/low-stock', auth, adminOnly, productController.getLowStockProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, adminOnly, upload.array('images', 5), productController.createProduct);
router.put('/:id', auth, adminOnly, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);
router.patch('/:id/stock', auth, adminOnly, productController.updateStock);

module.exports = router;
