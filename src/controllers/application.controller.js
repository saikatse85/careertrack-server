import prisma from "../config/prisma.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation.js";

/**
 * @desc Create Application
 * @route POST /api/applications
 * @access Private
 */
export const createApplication = async (req, res) => {
  try {
    const data = createApplicationSchema.parse(req.body);

    const application = await prisma.application.create({
      data: {
        ...data,
        applicationDate: new Date(data.applicationDate),
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully.",
      data: application,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Get All Applications (Only Logged In User)
 * @route GET /api/applications
 * @access Private
 */
/**
 * @desc Get All Applications (Search + Filter + Sort + Pagination)
 * @route GET /api/applications
 * @access Private
 */
export const getApplications = async (req, res) => {
  try {
    const {
      search,
      status,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Number(page);
    const perPage = Number(limit);

    const where = {
      userId: req.user.id,
    };

    // Search
    if (search) {
      where.OR = [
        {
          companyName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          jobTitle: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Filter
    if (status) {
      where.status = status;
    }

    // Sort
    let orderBy = {
      applicationDate: "desc",
    };

    switch (sort) {
      case "oldest":
        orderBy = {
          applicationDate: "asc",
        };
        break;

      case "company_asc":
        orderBy = {
          companyName: "asc",
        };
        break;

      case "company_desc":
        orderBy = {
          companyName: "desc",
        };
        break;

      case "newest":
      default:
        orderBy = {
          applicationDate: "desc",
        };
    }

    // Total Count
    const totalApplications = await prisma.application.count({
      where,
    });

    // Applications
    const applications = await prisma.application.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });

    res.status(200).json({
      success: true,
      pagination: {
        total: totalApplications,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(totalApplications / perPage),
      },
      data: applications,
    });
  } catch (error) {
    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Get Single Application
 * @route GET /api/applications/:id
 * @access Private
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Update Application
 * @route PATCH /api/applications/:id
 * @access Private
 */
export const updateApplication = async (req, res) => {
  try {
    const data = updateApplicationSchema.parse(req.body);

    const existing = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const updated = await prisma.application.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...data,
        ...(data.applicationDate && {
          applicationDate: new Date(data.applicationDate),
        }),
      },
    });

    res.json({
      success: true,
      message: "Application updated successfully.",
      data: updated,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Delete Application
 * @route DELETE /api/applications/:id
 * @access Private
 */
export const deleteApplication = async (req, res) => {
  try {
    const existing = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    await prisma.application.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    next(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};