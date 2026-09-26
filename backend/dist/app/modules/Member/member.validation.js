"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberValidation = void 0;
const zod_1 = require("zod");
const createMemberValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        memberCode: zod_1.z.string().optional(),
        fullName: zod_1.z.string().min(1, "Full name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        bloodGroup: zod_1.z.string().optional(),
        profession: zod_1.z.string().optional(),
        nidNo: zod_1.z.string().optional(),
        birthRegistrationNo: zod_1.z.string().optional(),
        fatherName: zod_1.z.string().optional(),
        motherName: zod_1.z.string().optional(),
        mobileNo: zod_1.z.string().min(1, "Mobile number is required"),
        dateOfBirth: zod_1.z.string().optional(),
        division: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
        thana: zod_1.z.string().optional(),
        presentAddress: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        designationBn: zod_1.z.string().optional(),
        councilCategory: zod_1.z
            .enum(["core_leadership", "financial_leadership", "general_member"])
            .optional(),
        role: zod_1.z.enum(["superadmin", "admin", "manager", "member"]).optional(),
        password: zod_1.z.string().optional(),
        totalDeposit: zod_1.z.number().optional(),
        savingsBalance: zod_1.z.number().optional(),
        dueAmount: zod_1.z.number().optional(),
        nomineeName: zod_1.z.string().optional(),
        nomineeRelation: zod_1.z.string().optional(),
        nomineeDob: zod_1.z.string().optional(),
        nomineeNid: zod_1.z.string().optional(),
        nomineeAddress: zod_1.z.string().optional(),
        nomineePictureUrl: zod_1.z.string().optional(),
        pictureUrl: zod_1.z.string().optional(),
        signatureUrl: zod_1.z.string().optional(),
        status: zod_1.z.enum(["active", "inactive", "blocked"]).optional(),
    }),
});
const updateMemberValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        memberCode: zod_1.z.string().optional(),
        fullName: zod_1.z.string().optional(),
        email: zod_1.z.string().email("Invalid email address").optional(),
        bloodGroup: zod_1.z.string().optional(),
        profession: zod_1.z.string().optional(),
        nidNo: zod_1.z.string().optional(),
        birthRegistrationNo: zod_1.z.string().optional(),
        fatherName: zod_1.z.string().optional(),
        motherName: zod_1.z.string().optional(),
        mobileNo: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional(),
        division: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
        thana: zod_1.z.string().optional(),
        presentAddress: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        designationBn: zod_1.z.string().optional(),
        councilCategory: zod_1.z
            .enum(["core_leadership", "financial_leadership", "general_member"])
            .optional(),
        role: zod_1.z.enum(["superadmin", "admin", "manager", "member"]).optional(),
        password: zod_1.z.string().optional(),
        totalDeposit: zod_1.z.number().optional(),
        savingsBalance: zod_1.z.number().optional(),
        dueAmount: zod_1.z.number().optional(),
        nomineeName: zod_1.z.string().optional(),
        nomineeRelation: zod_1.z.string().optional(),
        nomineeDob: zod_1.z.string().optional(),
        nomineeNid: zod_1.z.string().optional(),
        nomineeAddress: zod_1.z.string().optional(),
        nomineePictureUrl: zod_1.z.string().optional(),
        pictureUrl: zod_1.z.string().optional(),
        signatureUrl: zod_1.z.string().optional(),
        status: zod_1.z.enum(["active", "inactive", "blocked"]).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    })
        .partial(),
});
exports.MemberValidation = {
    createMemberValidationSchema,
    updateMemberValidationSchema,
};
//# sourceMappingURL=member.validation.js.map