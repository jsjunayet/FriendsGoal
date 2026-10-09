import { USER_ROLE } from "../modules/User/user.constant";
import { User } from "../modules/User/user.model";

const superAdminUser = {
  id: "0001",
  email: "asif@gmail.com",
  password: "admin12345",
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "active",
  isDeleted: false,
};

const adminUser = {
  id: "admin",
  email: "admin@friendsgoal.org",
  password: "admin12345",
  needsPasswordChange: false,
  role: USER_ROLE.admin,
  status: "active",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      $or: [{ role: USER_ROLE.superAdmin }, { email: "asif@gmail.com" }, { id: "0001" }],
    });

    if (!isSuperAdminExists) {
      await User.create(superAdminUser);
      console.log("Super Admin seeded: 0001 / asif@gmail.com (password: admin12345)");
    }

    const isAdminExists = await User.findOne({
      $or: [{ email: "admin@friendsgoal.org" }, { id: "admin" }],
    });

    if (!isAdminExists) {
      await User.create(adminUser);
      console.log("Admin seeded: admin / admin@friendsgoal.org (password: admin12345)");
    }
  } catch (err) {
    console.warn("Seeding admin error:", err);
  }
};

export default seedSuperAdmin;

