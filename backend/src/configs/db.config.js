import dotenv from 'dotenv';
import db from '../models/index.js';

dotenv.config();

const DB_OPTIONS = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('Lỗi: Thiếu MONGODB_URI trong biến môi trường');
        process.exit(1);
    }

    try {
        await db.mongoose.connect(MONGODB_URI, DB_OPTIONS);
        console.log('✅ Kết nối MongoDB thành công!');
        
        db.mongoose.connection.on('error', (err) => {
            console.error('❌ Lỗi kết nối MongoDB:', err);
        });

        db.mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Mất kết nối MongoDB');
        });

        await initRoles();

    } catch (error) {
        console.error('❌ Không thể kết nối đến MongoDB:', error.message);
        process.exit(1);
    }
};

const initRoles = async () => {
    try {
        const Role = db.role;
        const count = await Role.estimatedDocumentCount();

        if (count === 0) {
            await Promise.all([
                new Role({ name: db.ROLES.USER, description: "Người dùng thông thường" }).save(),
                new Role({ name: db.ROLES.MODERATOR, description: "Người kiểm duyệt" }).save(),
                new Role({ name: db.ROLES.ADMIN, description: "Quản trị viên" }).save()
            ]);
            console.log('✅ Khởi tạo roles thành công!');
        }
    } catch (err) {
        console.error('❌ Lỗi khởi tạo roles:', err);
    }
};
export default connectDB;