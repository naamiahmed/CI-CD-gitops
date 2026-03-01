/**
 * ============================================================
 * USER ROUTES
 * ============================================================
 * This file contains all API endpoints related to users
 * Operations: GET (list, get single), POST (create), PUT (update), DELETE
 * 
 * Base URL: /api/users
 * ============================================================
 */

// ============================================================
// 1. IMPORT REQUIRED MODULES
// ============================================================
const express = require('express');
const { users, generateId } = require('../data/database');

// ============================================================
// 2. CREATE ROUTER INSTANCE
// ============================================================
// Router allows us to define routes separately and mount them in the main app
const router = express.Router();

// ============================================================
// 3. VALIDATION FUNCTION
// ============================================================
// Helper function to validate user data
function validateUserData(data) {
  const errors = [];

  // Check if name exists and is not empty
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }

  // Check if email exists and has valid format
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Check if phone exists
  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone number is required');
  }

  return errors;
}

// ============================================================
// ROUTE 1: GET ALL USERS
// ============================================================
/**
 * GET /api/users
 * Retrieve all users from the database
 * 
 * Response:
 *  {
 *    success: true,
 *    data: [{ id, name, email, phone, createdAt }, ...],
 *    total: number
 *  }
 */
router.get('/', (req, res) => {
  try {
    // Return success response with all users
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      total: users.length,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 2: GET SINGLE USER BY ID
// ============================================================
/**
 * GET /api/users/:id
 * Retrieve a specific user by their ID
 * 
 * Parameters:
 *  id (path parameter): User ID to fetch
 * 
 * Response:
 *  {
 *    success: true,
 *    data: { id, name, email, phone, createdAt }
 *  }
 *  OR
 *  {
 *    success: false,
 *    message: 'User not found'
 *  }
 */
router.get('/:id', (req, res) => {
  try {
    // Extract ID from URL parameters
    const { id } = req.params;

    // Find user with matching ID
    // find() returns the first element that matches the condition
    const user = users.find((u) => u.id === id);

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        id,
      });
    }

    // Return the found user
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 3: CREATE NEW USER
// ============================================================
/**
 * POST /api/users
 * Create a new user
 * 
 * Request Body:
 *  {
 *    name: string (required),
 *    email: string (required),
 *    phone: string (required)
 *  }
 * 
 * Response:
 *  {
 *    success: true,
 *    message: 'User created successfully',
 *    data: { id, name, email, phone, createdAt }
 *  }
 */
router.post('/', (req, res) => {
  try {
    // Extract data from request body
    const { name, email, phone } = req.body;

    // Validate the received data
    const validationErrors = validateUserData({ name, email, phone });

    // If validation fails, return 400 Bad Request
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Create new user object with unique ID and timestamp
    const newUser = {
      id: generateId(), // Generate unique ID
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      createdAt: new Date(),
    };

    // Add the new user to the users array
    users.push(newUser);

    // Return 201 Created status with the new user
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 4: UPDATE USER
// ============================================================
/**
 * PUT /api/users/:id
 * Update an existing user
 * 
 * Parameters:
 *  id (path parameter): User ID to update
 * 
 * Request Body:
 *  {
 *    name?: string,
 *    email?: string,
 *    phone?: string
 *  }
 * 
 * Response:
 *  {
 *    success: true,
 *    message: 'User updated successfully',
 *    data: { updated user object }
 *  }
 */
router.put('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;
    // Extract update data from request body
    const { name, email, phone } = req.body;

    // Find the user to update
    const userIndex = users.findIndex((u) => u.id === id);

    // If user not found, return 404
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        id,
      });
    }

    // Prepare updated data (only include fields that are provided)
    const updatedUser = { ...users[userIndex] };
    if (name) updatedUser.name = name.trim();
    if (email) updatedUser.email = email.toLowerCase().trim();
    if (phone) updatedUser.phone = phone.trim();

    // Validate the updated data
    const validationErrors = validateUserData(updatedUser);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Replace the old user with the updated one
    users[userIndex] = updatedUser;

    // Return the updated user
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
});

// ============================================================
// ROUTE 5: DELETE USER
// ============================================================
/**
 * DELETE /api/users/:id
 * Delete a user
 * 
 * Parameters:
 *  id (path parameter): User ID to delete
 * 
 * Response:
 *  {
 *    success: true,
 *    message: 'User deleted successfully',
 *    data: { deleted user object }
 *  }
 */
router.delete('/:id', (req, res) => {
  try {
    // Extract ID from URL
    const { id } = req.params;

    // Find the index of user to delete
    const userIndex = users.findIndex((u) => u.id === id);

    // If user not found, return 404
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        id,
      });
    }

    // Remove the user from array using splice
    // splice(index, 1) removes 1 element at the specified index
    const deletedUser = users.splice(userIndex, 1)[0];

    // Return success with the deleted user data
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================
// Export this router to be used in the main server.js
module.exports = router;
