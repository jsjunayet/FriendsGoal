"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_constant_1 = require("../modules/User/user.constant");
const user_model_1 = require("../modules/User/user.model");
const superAdminUser = {
    id: "0001",
    email: "asif@gmail.com",
    password: "admin12345",
    needsPasswordChange: false,
    role: user_constant_1.USER_ROLE.superAdmin,
    status: "active",
    isDeleted: false,
};
const adminUser = {
    id: "admin",
    email: "admin@friendsgoal.org",
    password: "admin12345",
    needsPasswordChange: false,
    role: user_constant_1.USER_ROLE.admin,
    status: "active",
    isDeleted: false,
};
const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await user_model_1.User.findOne({
            $or: [{ role: user_constant_1.USER_ROLE.superAdmin }, { email: "asif@gmail.com" }, { id: "0001" }],
        });
        if (!isSuperAdminExists) {
            await user_model_1.User.create(superAdminUser);
            console.log("Super Admin seeded: 0001 / asif@gmail.com (password: admin12345)");
        }
        const isAdminExists = await user_model_1.User.findOne({
            $or: [{ email: "admin@friendsgoal.org" }, { id: "admin" }],
        });
        if (!isAdminExists) {
            await user_model_1.User.create(adminUser);
            console.log("Admin seeded: admin / admin@friendsgoal.org (password: admin12345)");
        }
    }
    catch (err) {
        console.warn("Seeding admin error:", err);
    }
};
exports.default = seedSuperAdmin;
//# sourceMappingURL=index.js.map