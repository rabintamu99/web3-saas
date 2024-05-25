import { S3Client, GetObjectCommand, PutObjectAclCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";



const s3Client = new S3Client({
    region: "us-east-1"
})
const command = new PutObjectAclCommand({
    Bucket: "decentralized-app",
    Key: "/saas/${}"
})
const router = Router();

const preSignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600
})

const prismaClient = new PrismaClient();


router.get("/presignedUrl",  (req, res) => {
})

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

