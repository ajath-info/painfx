import invoiceModel from "../models/invoiceModel.js";
import { apiResponse } from "../utils/helper.js";

const invoiceController = {
  generateInvoice: async (req, res) => {
    try {
      const { appointment_id, user_id, doctor_id, amount, payment_status } =
        req.body;

      if (!appointment_id || !user_id || !doctor_id || !amount) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Missing required fields",
        });
      }

      const invoice_id = await invoiceModel.createInvoice({
        appointment_id,
        user_id,
        doctor_id,
        total_amount: amount,
        payment_status,
      });

      return apiResponse(res, {
        message: "Invoice generated successfully",
        payload: { invoice_id },
      });
    } catch (error) {
      console.error("generateInvoice error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to generate invoice",
      });
    }
  },

  getByAppointment: async (req, res) => {
    try {
      const { appointment_id } = req.params;
      const invoice = await invoiceModel.getByAppointment(appointment_id);
      if (!invoice) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Invoice not found",
        });
      }
      return apiResponse(res, { payload: invoice });
    } catch (error) {
      console.error("getByAppointment error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch invoice",
      });
    }
  },

  getByUser: async (req, res) => {
    try {
      const { id } = req.user;
      const { page = 1, limit = 10 } = req.query;

      const { data, total } = await invoiceModel.getByUserId(
        id,
        parseInt(page),
        parseInt(limit)
      );
      return apiResponse(res, {
        payload: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          data,
        },
      });
    } catch (error) {
      console.error("getByUser error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch user invoices",
      });
    }
  },

  getByDoctor: async (req, res) => {
    try {
      const { id } = req.user;
      const { page = 1, limit = 10 } = req.query;

      const { data, total } = await invoiceModel.getByDoctorId(
        id,
        parseInt(page),
        parseInt(limit)
      );
      return apiResponse(res, {
        payload: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          data,
        },
      });
    } catch (error) {
      console.error("getByDoctor error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch doctor invoices",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { data, total } = await invoiceModel.getAll(
        parseInt(page),
        parseInt(limit)
      );
      return apiResponse(res, {
        payload: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          data,
        },
      });
    } catch (error) {
      console.error("getAll error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch invoices",
      });
    }
  },

  getFiltered: async (req, res) => {
    try {
      const { start_date, end_date, status, page = 1, limit = 10 } = req.query;

      const { data, total } = await invoiceModel.getFiltered({
        start_date,
        end_date,
        status,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      return apiResponse(res, {
        payload: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          data,
        },
      });
    } catch (error) {
      console.error("getFiltered error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch filtered invoices",
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await invoiceModel.updateStatus(id, status);
      return apiResponse(res, { message: "Invoice status updated" });
    } catch (error) {
      console.error("updateStatus error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update invoice status",
      });
    }
  },

  getInvoiceDetails: async (req, res) => {
    try {
      const { invoice_id } = req.params;

      if (!invoice_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invoice ID is required",
        });
      }

      const invoice = await invoiceModel.getInvoiceFullDetails(invoice_id);

      if (!invoice) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Invoice not found",
        });
      }

      return apiResponse(res, {
        message: "Invoice details fetched successfully",
        payload: invoice,
      });
    } catch (error) {
      console.error("getInvoiceDetails error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch invoice details",
      });
    }
  },
};

export default invoiceController;
