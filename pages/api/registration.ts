import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  let { current = 1, pageSize = 10 } = req.query;
  current = parseInt(current, 10);
  pageSize = parseInt(pageSize, 10);
  const session = await getSession({ req });
  const id = session.id as string;
  if (req.method === "GET") {
    const user = await prisma.user.findUnique({ where: { id } });

    console.log("!!!", user);

    let where = {};
    if (user.role === "USER") {
      where = { authorId: id };
    }
    const total = await prisma.patient.count({ where });
    const patients = await prisma.patient.findMany({
      skip: (current - 1) * pageSize,
      take: pageSize,
      where,
      select: {
        id: true,
        name: true,
        birthday: true,
        phone: true,
        email: true,
        address: true,
        driverLicense: true,
        appointmentTime: true,
        author: {
          select: {
            name: true,
          },
        },
      },

      // include: {
      //   author: {
      //     select: { name: true },
      //   },
      // },
    });
    res.status(200).json({
      list: patients,
      current,
      pageSize,
      total,
    });
  } else if (req.method === "POST") {
    const {
      name,
      birthday,
      phone,
      email,
      address,
      driverLicense,
      appointmentTime,
    } = req.body;

    const data = await prisma.patient.create({
      data: {
        name,
        birthday,
        phone,
        email,
        address,
        driverLicense,
        appointmentTime,
        author: {
          connect: {
            id,
          },
        },
      },
    });
    res.status(200).json(data);
  }
}
