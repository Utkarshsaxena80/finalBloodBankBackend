import { Request, Response } from "express";
import { prisma } from "../utils/prisma.utils.ts";

export const getBloodBanks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const allBankDetails = await prisma.bloodBank.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        state: true,
        pincode: true,
        contactMobile: true,
        email: true,
        contactPerson: true,
      },
      skip: skip,
      take: limit,
    });
    const totalBanks = await prisma.bloodBank.count();
    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBanks / limit),
        totalItems: totalBanks
      },
      data: allBankDetails
    });
  } catch (error) {
    console.error("Error fetching blood banks:", error);
    res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};