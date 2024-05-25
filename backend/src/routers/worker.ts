import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";


const router = Router();
const JWT_SECRET = "secret";
const prismaClient = new PrismaClient();

router.post("/signin",  async(req, res) => {
   const hardcodedWalletAddress = "0x1234567890123456789012345678901234567890";
   
   const existingUser = await prismaClient.user.findFirst({
      where: {
         address: hardcodedWalletAddress
      }
   });


  if (existingUser) {
    const token = jwt.sign({
        userId: existingUser.id,

    }, JWT_SECRET)
  } else {
    const newUser = await prismaClient.user.create({
      data: {
        address: hardcodedWalletAddress
      }
    })
    const token = jwt.sign({
        userId: newUser.id,
  }, JWT_SECRET)

  res.json({
    token
  })
}
});

export default router;
