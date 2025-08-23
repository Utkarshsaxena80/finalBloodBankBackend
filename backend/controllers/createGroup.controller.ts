import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.utils.ts';
import { z } from 'zod';

const createGroupSchema = z.object({
  name: z.string().trim().min(3, { message: "Group name must be at least 3 characters long" }),
  description: z.string().trim().optional(),
});

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description } = createGroupSchema.parse(req.body);

    const userEmail = req.requestId; 
    if (!userEmail) {
      return res.status(401).json({ error: "Authentication error: User email not found." });
    }
    const bloodBank = await prisma.bloodBank.findFirst({
        where: {
            email: userEmail 
        },
        select: {
            id: true
        }
    });

    if (!bloodBank) {
        return res.status(404).json({ error: "Authenticated user's blood bank could not be found." });
    }
    
    const ownerId = bloodBank.id;

    const newGroup = await prisma.$transaction(async (tx) => {
      const group = await tx.bloodBankGroup.create({
        data: {
          name,
          description,
          ownerId: ownerId, 
        },
      });

      await tx.groupMember.create({
        data: {
          bloodBankId: ownerId, 
          bloodBankGroupId: group.id,
        },
      });
      
      return group;
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully.",
      data: newGroup,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Invalid input data.", errors: error.flatten().fieldErrors });
    }
    console.error("Error creating group:", error);
    return res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};