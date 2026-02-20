const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopHub E-commerce API',
      version: '1.0.0',
      description: `
        A comprehensive e-commerce REST API built with Node.js, Express, and MongoDB.
        
        Features:
        - User authentication with JWT
        - Product management with reviews
        - Shopping cart functionality
        - Order processing with Tanzanian mobile payment simulation
        - Admin dashboard capabilities
        - Role-based access control
      `,
      contact: {
        name: 'API Support',
        email: 'support@shophub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            avatar: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            phone: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  public_id: { type: 'string' }
                }
              }
            },
            category: { 
              type: 'string',
              enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food', 'Other']
            },
            brand: { type: 'string' },
            stock: { type: 'number' },
            ratings: { type: 'number' },
            numReviews: { type: 'number' },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  name: { type: 'string' },
                  rating: { type: 'number' },
                  comment: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            isFeatured: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            orderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  quantity: { type: 'number' },
                  image: { type: 'string' },
                  price: { type: 'number' },
                  product: { type: 'string' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            paymentMethod: { 
              type: 'string',
              enum: ['Credit Card', 'PayPal', 'Cash on Delivery', 'Mobile Money', 'Mobile Banking']
            },
            paymentResult: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                update_time: { type: 'string' },
                email_address: { type: 'string' }
              }
            },
            itemsPrice: { type: 'number' },
            taxPrice: { type: 'number' },
            shippingPrice: { type: 'number' },
            totalPrice: { type: 'number' },
            isPaid: { type: 'boolean' },
            paidAt: { type: 'string', format: 'date-time' },
            isDelivered: { type: 'boolean' },
            deliveredAt: { type: 'string', format: 'date-time' },
            orderStatus: {
              type: 'string',
              enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product management endpoints'
      },
      {
        name: 'Orders',
        description: 'Order processing and management'
      },
      {
        name: 'Users',
        description: 'User management (Admin only)'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;