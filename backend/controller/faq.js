import faqModel from "../models/faqModel.js";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";

const faqController = {
  addOrUpdate: async (req, res) => {
    try {
      const { id, question, answer } = req.body;

      if (!question || validator.isEmpty(question.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "FAQ question is required",
        });
      }

      if (!answer || validator.isEmpty(answer.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "FAQ answer is required",
        });
      }

      if (id) {
        const existing = await faqModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "FAQ not found",
          });
        }
        await faqModel.update(id, { question, answer });
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "FAQ updated successfully",
        });
      } else {
        await faqModel.create({ question, answer });
        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "FAQ added successfully",
        });
      }
    } catch (error) {
      console.error("Error in addOrUpdate FAQ:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const { total, rows } = await faqModel.getPaginated(limit, offset);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: { total, page, limit, data: rows },
      });
    } catch (error) {
      console.error("Error in getAll FAQs:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch FAQs",
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const rows = await faqModel.getActive();
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: rows,
      });
    } catch (error) {
      console.error("Error in getActive FAQs:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch active FAQs",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await faqModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "FAQ not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";
      await faqModel.toggleStatus(id, newStatus);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `FAQ ${
          newStatus === "1" ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error) {
      console.error("Error in toggleStatus:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  deleteFAQ: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await faqModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "FAQ not found",
        });
      }

      await faqModel.delete(id);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "FAQ deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteFAQ:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};

export default faqController;
