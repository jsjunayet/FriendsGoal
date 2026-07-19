"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_constant_1 = require("../modules/User/user.constant");
const user_model_1 = require("../modules/User/user.model");
const superUser = {
    id: "0001",
    email: "asif@gmail.com",
    password: "admin12345",
    needsPasswordChange: false,
    role: user_constant_1.USER_ROLE.superAdmin,
    status: "in-progress",
    isDeleted: false,
};
const seedSuperAdmin = async () => {
    //when database is connected, we will check is there any user who is super admin
    const isSuperAdminExits = await user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExits) {
        await user_model_1.User.create(superUser);
    }
};
exports.default = seedSuperAdmin;
//# sourceMappingURL=index.js.map