import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const combinedRegistrationSchema = z.object({
  bloodBank: z.object({
    name: z.string().trim().min(1, { message: "Blood bank name is required" }),
    address: z.string().trim().min(1, { message: "Address is required" }),
    state: z.string().trim().min(1, { message: "State/UT is required" }),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid Indian pincode"),
    contactMobile: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Indian mobile number"),
    email: z.string().email("Invalid email address").toLowerCase(),
    contactPerson: z.string().trim().min(1, { message: "Contact person name is required" }),
    registrationNo: z.string().trim().min(1, { message: "Registration number is required" }),
    gstNo: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number").optional(),
    bankAccountDetails: z.string().trim().min(1, { message: "Bank account details are required" }),
    bankName: z.string().trim().min(1, { message: "Bank name is required" }),
    ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID").optional(),
  }),
  admin: z.object({
    name: z.string().trim().min(1, { message: "Admin name is required" }),
    designation: z.string().trim().min(1, { message: "Designation is required" }),
    contactMobile: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid admin mobile number"),
    email: z.string().email("Invalid admin email address").toLowerCase(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  }),
});

/**
 * @route POST /api/v1/register
 * @description Registers a new blood bank and its first administrator.
 * @access Public
 */

const unifiedRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bloodBank: bloodBankData, admin: adminData } = combinedRegistrationSchema.parse(req.body);

    const existingBloodBank = await prisma.bloodBank.findFirst({
      where: { OR: [{ email: bloodBankData.email }, { registrationNo: bloodBankData.registrationNo }] },
    });
    if (existingBloodBank) {
      res.status(409).json({ success: false, message: "A blood bank with this email or registration number already exists." });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email: adminData.email } });

    if (existingAdmin) {
      res.status(409).json({ success: false, message: "An admin with this email already exists." });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const result = await prisma.$transaction(async (tx) => {
      const newBloodBank = await tx.bloodBank.create({
        data: bloodBankData,
      });
      const newAdmin = await tx.admin.create({
        data: {
          ...adminData,
          password: hashedPassword,
          bloodBankId: newBloodBank.id,
        },
      });

      return { newBloodBank, newAdmin };
    });
    const { password, ...adminResult } = result.newAdmin;

    res.status(201).json({
      success: true,
      message: "Blood bank and administrator registered successfully.",
      data: {
        bloodBank: result.newBloodBank,
        admin: adminResult,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid input data.", errors: error.flatten().fieldErrors });
    } else {
      console.error("Error during unified registration:", error);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  }
};
export { unifiedRegistration };
