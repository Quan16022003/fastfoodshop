const mongoose = require('mongoose');
const User = require('./user.model');
const Role = require('./role.model');
const Product = require('./product.model');
const Category = require('./category.model');

const db = {
    mongoose,
    user: User,
    role: Role,
    product: Product,
    category: Category,
    ROLES: {
        USER: "user",
        ADMIN: "admin",
        MODERATOR: "moderator"
    }
};

module.exports = db;