const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};

    // Search by keyword (name or description)
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by brand
    if (req.query.brand) {
      query.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Filter by rating
    if (req.query.minRating) {
      query.ratings = { $gte: Number(req.query.minRating) };
    }

    // Filter by stock availability
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    // Build sort object
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort.price = 1;
          break;
        case 'price_desc':
          sort.price = -1;
          break;
        case 'rating':
          sort.ratings = -1;
          break;
        case 'newest':
          sort.createdAt = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    // Execute query
    const products = await Product.find(query)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name email')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      brand,
      stock
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      images: images || [],
      category,
      brand,
      stock: stock || 0,
      user: req.user._id // Admin who created it
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    );

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(8)
      .sort('-createdAt');

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ ratings: { $gte: 4 } })
      .sort('-ratings')
      .limit(8);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ 
        message: 'Please provide rating and comment' 
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    // Create review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);

    // Update product ratings
    product.numReviews = product.reviews.length;
    product.ratings = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the review
    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this review' 
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Recalculate ratings
    product.ratings = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the review
    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this review' 
      });
    }

    // Remove review
    review.deleteOne();

    // Recalculate ratings
    product.numReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.ratings = 
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
        product.reviews.length;
    } else {
      product.ratings = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Review removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};