/**
 * ============================================================
 * PRODUCT ROUTES
 * ============================================================
 * This file contains all API endpoints related to products
 * Operations: GET (list, get single), POST (create), PUT (update), DELETE
 * 
 * Base URL: /api/products
 * ============================================================
 */

// ============================================================
// 1. IMPORT REQUIRED MODULES
// ============================================================
const express = require('express');
const { products, generateId } = require('../data/database');

// ============================================================
// 2. CREATE ROUTER INSTANCE
// ============================================================
const router = express.Router();

// ============================================================
// 3. VALIDATION FUNCTION
// ============================================================
// Helper function to validate product data
function validateProductData(data) {
  const errors = [];

  // Check if name exists and is not empty
  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required');
  }

  // Check if price exists and is a positive number
  if (data.price === undefined || data.price <= 0) {
    errors.push('Price must be a positive number');
  }

  // Check if stock exists and is a non-negative number
  if (data.stock === undefined || data.stock < 0) {
    errors.push('Stock must be a non-negative number');
  }

  return errors;
}

// ============================================================
// ROUTE 1: GET ALL PRODUCTS
// ============================================================
/**
 * GET /api/products
 * Retrieve all products from the database
 * Optional query parameters:
 *  - category: Filter by category
 *  - minPrice: Filter by minimum price
 *  - maxPrice: Filter by maximum price
 * 
 * Examples:
 *  GET /api/products
 *  GET /api/products?category=Electronics
 *  GET /api/products?minPrice=1000&maxPrice=50000
 */
router.get('/', (req, res) => {
  try {
    // Get query parameters from URL
    const { category, minPrice, maxPrice } = req.query;

    // Start with all products
    let filteredProducts = [...products];

    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by minimum price if provided
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= parseFloat(minPrice)
      );
    }

    // Filter by maximum price if provided
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= parseFloat(maxPrice)
      );
    }

    // Return filtered products
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 2: GET SINGLE PRODUCT BY ID
// ============================================================
/**
 * GET /api/products/:id
 * Retrieve a specific product by its ID
 */
router.get('/:id', (req, res) => {
  try {
    // Extract ID from URL parameters
    const { id } = req.params;

    // Find product with matching ID
    const product = products.find((p) => p.id === id);

    // If product not found, return 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        id,
      });
    }

    // Return the found product
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 3: CREATE NEW PRODUCT
// ============================================================
/**
 * POST /api/products
 * Create a new product
 * 
 * Request Body:
 *  {
 *    name: string (required),
 *    description: string (optional),
 *    price: number (required),
 *    stock: number (required),
 *    category: string (optional)
 *  }
 */
router.post('/', (req, res) => {
  try {
    // Extract data from request body
    const { name, description, price, stock, category } = req.body;

    // Validate the received data
    const validationErrors = validateProductData({ name, description, price, stock, category });

    // If validation fails, return 400 Bad Request
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Create new product object with unique ID and timestamp
    const newProduct = {
      id: generateId(),
      name: name.trim(),
      description: description ? description.trim() : '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category ? category.trim() : 'Uncategorized',
      createdAt: new Date(),
    };

    // Add the new product to the products array
    products.push(newProduct);

    // Return 201 Created status with the new product
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 4: UPDATE PRODUCT
// ============================================================
/**
 * PUT /api/products/:id
 * Update an existing product
 * 
 * Parameters:
 *  id (path parameter): Product ID to update
 * 
 * Request Body: Any fields you want to update
 */
router.put('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;
    // Extract update data from request body
    const { name, description, price, stock, category } = req.body;

    // Find the product to update
    const productIndex = products.findIndex((p) => p.id === id);

    // If product not found, return 404
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        id,
      });
    }

    // Prepare updated data (only include fields that are provided)
    const updatedProduct = { ...products[productIndex] };
    if (name) updatedProduct.name = name.trim();
    if (description) updatedProduct.description = description.trim();
    if (price !== undefined) updatedProduct.price = parseFloat(price);
    if (stock !== undefined) updatedProduct.stock = parseInt(stock);
    if (category) updatedProduct.category = category.trim();

    // Validate the updated data
    const validationErrors = validateProductData(updatedProduct);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Replace the old product with the updated one
    products[productIndex] = updatedProduct;

    // Return the updated product
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 5: DELETE PRODUCT
// ============================================================
/**
 * DELETE /api/products/:id
 * Delete a product
 */
router.delete('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;

    // Find the index of product to delete
    const productIndex = products.findIndex((p) => p.id === id);

    // If product not found, return 404
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        id,
      });
    }

    // Remove the product from array
    const deletedProduct = products.splice(productIndex, 1)[0];

    // Return success with the deleted product data
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 6: GET IN-STOCK PRODUCTS
// ============================================================
/**
 * GET /api/products/stock/available
 * Get all products that have stock available
 */
router.get('/stock/available', (req, res) => {
  try {
    // Filter products with stock > 0
    const availableProducts = products.filter((p) => p.stock > 0);

    res.status(200).json({
      success: true,
      message: 'Available products retrieved successfully',
      data: availableProducts,
      total: availableProducts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving available products',
      error: error.message,
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================
module.exports = router;
