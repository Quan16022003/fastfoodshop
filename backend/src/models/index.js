import mongoose from 'mongoose';
import User from './user.model.js';
import Role from './role.model.js';
import Product from './product.model.js';
import Category from './category.model.js';

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

export default db;