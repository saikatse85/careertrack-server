import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalApplications,
      saved,
      applied,
      assessment,
      interview,
      offer,
      rejected,
    ] = await Promise.all([
      prisma.application.count({
        where: { userId },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "SAVED",
        },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "APPLIED",
        },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "ASSESSMENT",
        },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "INTERVIEW",
        },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "OFFER",
        },
      }),

      prisma.application.count({
        where: {
          userId,
          status: "REJECTED",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        saved,
        applied,
        assessment,
        interview,
        offer,
        rejected,
      },
    });
  } catch (error) {
    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};