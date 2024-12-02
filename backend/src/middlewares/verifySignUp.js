import db from '../models/index.js';

const { user: User, ROLES } = db;
const roles = Object.values(ROLES);

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }

        next();
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const checkRolesExisted = (req, res, next) => {
    try {
        if (req.body.roles && req.body.roles.length) {
            const invalidRoles = req.body.roles.filter(role => !roles.includes(role));
            if (invalidRoles.length) {
                return res.status(400).send({
                    message: `Failed! Role(s) ${invalidRoles.join(', ')} do not exist!`
                });
            }
        }
        next();
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const checkPassword = (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;

        // Kiểm tra độ dài tối thiểu
        if (password.length < 6) {
            return res.status(400).send({
                message: "The password must be at least 6 characters long!"
            });
        }

        // Kiểm tra có ít nhất 1 chữ hoa, 1 chữ thường và 1 số
        // const hasUpperCase = /[A-Z]/.test(password);
        // const hasLowerCase = /[a-z]/.test(password);
        // const hasNumber = /\d/.test(password);

        // if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        //     return res.status(400).send({
        //         message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!"
        //     });
        // }

        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
            return res.status(400).send({
                message: "Passwords do not match!"
            });
        }

        next();
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

export const verifySignUp = {
    checkDuplicateEmail,
    checkRolesExisted,
    checkPassword
};
