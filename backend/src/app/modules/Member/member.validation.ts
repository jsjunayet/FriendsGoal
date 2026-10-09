import { z } from "zod";

const createMemberValidationSchema = z.object({
  body: z.object({
    memberCode: z.string().optional(),
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Please enter a valid email address (e.g. user@example.com)"),
    bloodGroup: z.string().optional(),
    profession: z.string().optional(),
    nidNo: z.string().optional(),
    birthRegistrationNo: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    mobileNo: z.string().trim().min(1, "Mobile number is required"),
    dateOfBirth: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    thana: z.string().optional(),
    presentAddress: z.string().optional(),

    designation: z.string().optional(),
    designationBn: z.string().optional(),
    councilCategory: z
      .enum(["core_leadership", "financial_leadership", "general_member"])
      .optional(),

    role: z.enum(["superadmin", "admin", "manager", "member"]).optional(),
    password: z.string().optional(),
    totalDeposit: z.number().optional(),
    savingsBalance: z.number().optional(),
    dueAmount: z.number().optional(),

    nomineeName: z.string().optional(),
    nomineeRelation: z.string().optional(),
    nomineeDob: z.string().optional(),
    nomineeNid: z.string().optional(),
    nomineeAddress: z.string().optional(),
    nomineePictureUrl: z.string().optional(),
    pictureUrl: z.string().optional(),
    signatureUrl: z.string().optional(),
    status: z.enum(["active", "inactive", "blocked"]).optional(),
  }),
});

const updateMemberValidationSchema = z.object({
  body: z
    .object({
      memberCode: z.string().optional(),
      fullName: z.string().optional(),
      email: z.string().email("Invalid email address").optional(),
      bloodGroup: z.string().optional(),
      profession: z.string().optional(),
      nidNo: z.string().optional(),
      birthRegistrationNo: z.string().optional(),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      mobileNo: z.string().optional(),
      dateOfBirth: z.string().optional(),
      division: z.string().optional(),
      district: z.string().optional(),
      thana: z.string().optional(),
      presentAddress: z.string().optional(),

      designation: z.string().optional(),
      designationBn: z.string().optional(),
      councilCategory: z
        .enum(["core_leadership", "financial_leadership", "general_member"])
        .optional(),

      role: z.enum(["superadmin", "admin", "manager", "member"]).optional(),
      password: z.string().optional(),
      totalDeposit: z.number().optional(),
      savingsBalance: z.number().optional(),
      dueAmount: z.number().optional(),

      nomineeName: z.string().optional(),
      nomineeRelation: z.string().optional(),
      nomineeDob: z.string().optional(),
      nomineeNid: z.string().optional(),
      nomineeAddress: z.string().optional(),
      nomineePictureUrl: z.string().optional(),
      pictureUrl: z.string().optional(),
      signatureUrl: z.string().optional(),
      status: z.enum(["active", "inactive", "blocked"]).optional(),
      isDeleted: z.boolean().optional(),
    })
    .partial(),
});

export const MemberValidation = {
  createMemberValidationSchema,
  updateMemberValidationSchema,
};
