// //creates group 
// //name 
// //description 
// import { Request, Response } from 'express';
// import { prisma } from '../utils/prisma.utils.ts';
// import { z } from 'zod';

// const createGroupSchema = z.object({
//   name: z.string().trim().min(3, { message: "Group name must be at least 3 characters long" }),
//   description: z.string().trim().optional(),
// });

// /**
//  * @route POST /api/groups
//  * @description Creates a new blood bank group. The owner is automatically the first member.
//  */
// export const createGroup = async (req: Request, res: Response) => {
//   try {
//     const { name, description } = createGroupSchema.parse(req.body);
//     const ownerId = req.user?.bloodBankId;

//     if (!ownerId) {
//       return res.status(401).json({ error: "Authentication error: User information not found." });
//     }

//     const newGroup = await prisma.bloodBankGroup.create({
//       data: {
//         name,
//         description,
//         ownerId: ownerId,
//       },
//     });
    
//     // Add the owner as the first member
//     await prisma.groupMember.create({
//         data: {
//             bloodBankId: ownerId,
//             bloodBankGroupId: newGroup.id,
//         }
//     });

//     return res.status(201).json({ success: true, message: "Group created successfully.", data: newGroup });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
//     }
//     console.error("Error creating group:", error);
//     return res.status(500).json({ success: false, message: "An internal server error occurred." });
//   }
// };

// /**
//  * @route POST /api/groups/:groupId/requests
//  * @description Sends a request to join a specific group.
//  */
// export const sendJoinRequest = async (req: Request, res: Response) => {
//   try {
//     const { groupId } = req.params;
//     const requesterId = req.user?.bloodBankId;

//     if (!requesterId) {
//       return res.status(401).json({ error: "Authentication error." });
//     }

//     const newRequest = await prisma.groupJoinRequest.create({
//       data: {
//         requesterId: requesterId,
//         groupId: groupId,
//       },
//     });

//     res.status(201).json({ success: true, message: "Join request sent successfully.", data: newRequest });
//   } catch (error) {
//     if (error.code === 'P2002') { // Handles duplicate request error
//         return res.status(409).json({ error: "You have already sent a request to join this group." });
//     }
//     console.error("Error sending join request:", error);
//     res.status(500).json({ success: false, message: "An internal server error occurred." });
//   }
// };

// /**
//  * @route POST /api/groups/:groupId/requests/:requestId/approve
//  * @description Approves a pending join request (Owner only).
//  */
// export const approveJoinRequest = async (req: Request, res: Response) => {
//     try {
//         const { groupId, requestId } = req.params;
//         const currentUserId = req.user?.bloodBankId;

//         await prisma.$transaction(async (tx) => {
//             const group = await tx.bloodBankGroup.findFirst({ where: { id: groupId, ownerId: currentUserId } });
//             if (!group) {
//                 throw new Error("FORBIDDEN");
//             }

//             const request = await tx.groupJoinRequest.update({
//                 where: { id: requestId, status: 'PENDING' },
//                 data: { status: 'APPROVED' }
//             });

//             await tx.groupMember.create({
//                 data: {
//                     bloodBankId: request.requesterId,
//                     bloodBankGroupId: groupId
//                 }
//             });
//         });
        
//         res.status(200).json({ success: true, message: "Request approved and member added." });
//     } catch (error) {
//         if (error.message === 'FORBIDDEN') {
//             return res.status(403).json({ error: "Forbidden: Only the group owner can approve requests." });
//         }
//         res.status(500).json({ success: false, message: "An internal server error occurred." });
//     }
// };