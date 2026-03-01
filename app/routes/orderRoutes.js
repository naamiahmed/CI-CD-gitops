/**
 * ============================================================
 * ORDER ROUTES
 * ============================================================
 * This file contains all API endpoints related to orders
 * Operations: GET (list, get single), POST (create), PUT (update status), DELETE
 * 
 * Base URL: /api/orders
 * ============================================================
 */

// ============================================================
// 1. IMPORT REQUIRED MODULES
// ============================================================
const express = require('express');
const { orders, users, products, generateId } = require('../data/database');

// ============================================================
// 2. CREATE ROUTER INSTANCE
// ============================================================
const router = express.Router();

// ============================================================
// 3. VALIDATION FUNCTION
// ============================================================
// Helper function to validate order data
function validateOrderData(data) {
  const errors = [];

  // Check if userId exists
  if (!data.userId || data.userId.trim() === '') {
    errors.push('User ID is required');
  }

  // Check if items array exists and is not empty
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  // Validate each item in the order
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });
  }

  return errors;
}

// ============================================================
// HELPER FUNCTION: Calculate Order Total
// ============================================================
// Function to calculate the total amount for an order
function calculateOrderTotal(items) {
  let total = 0;

  // Sum up the price of all items (quantity * price)
  items.forEach((item) => {
    total += item.price * item.quantity;
  });

  return total;
}

// ============================================================
// ROUTE 1: GET ALL ORDERS
// ============================================================
/**
 * GET /api/orders
 * Retrieve all orders from the database
 * 
 * Optional query parameters:
 *  - status: Filter by order status (Pending, Processing, Shipped, Delivered)
 *  - userId: Filter orders by user ID
 * 
 * Examples:
 *  GET /api/orders
 *  GET /api/orders?status=Delivered
 *  GET /api/orders?userId=abc123
 */
router.get('/', (req, res) => {
  try {
    // Get query parameters from URL
    const { status, userId } = req.query;

    // Start with all orders
    let filteredOrders = [...orders];

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by userId if provided
    if (userId) {
      filteredOrders = filteredOrders.filter((o) => o.userId === userId);
    }

    // Return filtered orders
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: filteredOrders,
      total: filteredOrders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 2: GET SINGLE ORDER BY ID
// ============================================================
/**
 * GET /api/orders/:id
 * Retrieve a specific order by its ID
 */
router.get('/:id', (req, res) => {
  try {
    // Extract ID from URL parameters
    const { id } = req.params;

    // Find order with matching ID
    const order = orders.find((o) => o.id === id);

    // If order not found, return 404
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        id,
      });
    }

    // Get user information for this order
    const user = users.find((u) => u.id === order.userId);

    // Return the found order with user info
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: {
        ...order,
        userInfo: user || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 3: CREATE NEW ORDER
// ============================================================
/**
 * POST /api/orders
 * Create a new order
 * 
 * Request Body:
 *  {
 *    userId: string (required),
 *    items: [
 *      {
 *        productId: string (required),
 *        quantity: number (required)
 *      },
 *      ...
 *    ]
 *  }
 * 
 * Example Request:
 *  {
 *    "userId": "user-id-123",
 *    "items": [
 *      { "productId": "prod-1", "quantity": 2 },
 *      { "productId": "prod-2", "quantity": 1 }
 *    ]
 *  }
 */
router.post('/', (req, res) => {
  try {
    // Extract data from request body
    const { userId, items } = req.body;

    // Validate the received data
    const validationErrors = validateOrderData({ userId, items });

    // If validation fails, return 400 Bad Request
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Check if user exists
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        userId,
      });
    }

    // Process each item and add price information
    const processedItems = items.map((item) => {
      // Find the product to get its price
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Check if sufficient stock is available
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Return item with price information
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
      };
    });

    // Calculate the total order amount
    const totalAmount = calculateOrderTotal(processedItems);

    // Create new order object with unique ID and timestamp
    const newOrder = {
      id: generateId(),
      userId,
      items: processedItems,
      totalAmount,
      status: 'Pending', // New orders start with Pending status
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Reduce stock for ordered products
    processedItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    });

    // Add the new order to the orders array
    orders.push(newOrder);

    // Return 201 Created status with the new order
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 4: UPDATE ORDER STATUS
// ============================================================
/**
 * PUT /api/orders/:id
 * Update an existing order (mainly the status)
 * 
 * Parameters:
 *  id (path parameter): Order ID to update
 * 
 * Request Body:
 *  {
 *    status: string (required)
 *    // Valid statuses: Pending, Processing, Shipped, Delivered, Cancelled
 *  }
 * 
 * Example:
 *  PUT /api/orders/order-123
 *  { "status": "Shipped" }
 */
router.put('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;
    // Extract status from request body
    const { status } = req.body;

    // Validate status is provided
    if (!status || status.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Status is required'],
      });
    }

    // Define valid order statuses
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    // Check if provided status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        errors: [`Status must be one of: ${validStatuses.join(', ')}`],
      });
    }

    // Find the order to update
    const orderIndex = orders.findIndex((o) => o.id === id);

    // If order not found, return 404
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        id,
      });
    }

    // Update the order
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    // Return the updated order
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: orders[orderIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 5: DELETE ORDER
// ============================================================
/**
 * DELETE /api/orders/:id
 * Delete an order (only if it's still Pending)
 */
router.delete('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;

    // Find the index of order to delete
    const orderIndex = orders.findIndex((o) => o.id === id);

    // If order not found, return 404
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        id,
      });
    }

    // Get the order to check its status
    const order = orders[orderIndex];

    // Only allow deletion if order is still Pending
    if (order.status !== 'Pending' && order.status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete order',
        reason: `Order status is ${order.status}. Can only delete Pending or Cancelled orders.`,
      });
    }

    // Restore stock for cancelled order items
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    });

    // Remove the order from array
    const deletedOrder = orders.splice(orderIndex, 1)[0];

    // Return success with the deleted order data
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 6: GET USER ORDER HISTORY
// ============================================================
/**
 * GET /api/orders/user/:userId
 * Get all orders for a specific user
 */
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        userId,
      });
    }

    // Get all orders for this user
    const userOrders = orders.filter((o) => o.userId === userId);

    res.status(200).json({
      success: true,
      message: 'User order history retrieved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      data: userOrders,
      total: userOrders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user order history',
      error: error.message,
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================
module.exports = router;
