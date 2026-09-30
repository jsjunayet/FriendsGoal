export const USER_ROLE = {
  superAdmin: "superAdmin",
  admin: "admin",
  manager: "manager",
  member: "member",
  faculty: "faculty",
  student: "student",
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
