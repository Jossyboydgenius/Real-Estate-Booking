const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/prismaConfig.js");

exports.createResidency = asyncHandler(async (req, res) => {
  const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data;

  try {
    const residency = await prisma.residency.create({
      data: {
        title, description, price, address, country, city, facilities, image,
        owner: { connect: { email: userEmail } },
      }
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already exists");
    }
    throw new Error(err.message);
  }
});

exports.getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({ orderBy: { createdAt: "desc" } });
  res.send(residencies);
});

exports.getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const residency = await prisma.residency.findUnique({ where: { id } });
  res.send(residency);
});
