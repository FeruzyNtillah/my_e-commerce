const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *               - itemsPrice
 *               - taxPrice
 *               - shippingPrice
 *               - totalPrice
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: iPhone 15 Pro
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     image:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     price:
 *                       type: number
 *                       example: 999
 *                     product:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Samora Avenue
 *                   city:
 *                     type: string
 *                     example: Dar es Salaam
 *                   state:
 *                     type: string
 *                     example: Dar es Salaam
 *                   zipCode:
 *                     type: string
 *                     example: "12345"
 *                   country:
 *                     type: string
 *                     example: Tanzania
 *                   mobileNumber:
 *                     type: string
 *                     example: "+255712345678"
 *                   region:
 *                     type: string
 *                     example: Dar es Salaam
 *                   district:
 *                     type: string
 *                     example: Kinondoni
 *                   residence:
 *                     type: string
 *                     example: Mikocheni
 *               paymentMethod:
 *                 type: string
 *                 enum: [Credit Card, PayPal, Cash on Delivery, Mobile Money, Mobile Banking]
 *                 example: Mobile Money
 *               itemsPrice:
 *                 type: number
 *                 example: 999
 *               taxPrice:
 *                 type: number
 *                 example: 179.82
 *               shippingPrice:
 *                 type: number
 *                 example: 5
 *               totalPrice:
 *                 type: number
 *                 example: 1183.82
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, createOrder);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to view this order
 */
router.get('/:id', protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Update order to paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: MPESA1234567890
 *                 description: Transaction ID from payment provider
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *               update_time:
 *                 type: string
 *                 format: date-time
 *               email_address:
 *                 type: string
 *                 format: email
 *               provider:
 *                 type: string
 *                 example: mpesa
 *               phone_number:
 *                 type: string
 *                 example: "+255712345678"
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to update this order
 */
router.put('/:id/pay', protect, updateOrderToPaid);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/', protect, admin, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [Processing, Shipped, Delivered, Cancelled]
 *                 example: Shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.put('/:id/status', protect, admin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;