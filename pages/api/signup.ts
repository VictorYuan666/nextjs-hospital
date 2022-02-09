import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, password } = req.body;
    const user = await prisma.user.findUnique({ where: { name } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const data = await prisma.user.create({
      data: {
        name,
        password,
      },
    });
    res.status(200).json(data);
  }
}
