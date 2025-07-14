import stripe from "../config/strip.js";
import paymentModel from "../models/paymentModel.js";
import { apiResponse } from "../utils/helper.js";
import { db } from "../config/db.js";

const paymentController = {
  // Create intent
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, appointment_id, doctor_id, currency = "AUD" } = req.body;
      const user_id = req.user.id;

      if (!amount || !appointment_id || !doctor_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Missing required fields",
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // cents
        currency,
        metadata: {
          user_id,
          doctor_id,
          appointment_id,
        },
      });

      return apiResponse(res, {
        code: 200,
        status: 1,
        message: "Payment intent created",
        payload: {
          clientSecret: paymentIntent.client_secret,
          intentId: paymentIntent.id,
        },
      });
    } catch (err) {
      console.error("Stripe error:", err.message);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to create payment intent",
      });
    }
  },

  // Verify and save and also set status of appointment and invoice as paid
  verifyAndSavePayment: async (req, res) => {
    try {
      const { payment_intent_id, appointment_id, doctor_id } = req.body;
      const user_id = req.user.id;

      if (!payment_intent_id || !appointment_id || !doctor_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Missing required fields",
        });
      }

      const intent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (intent.status !== "succeeded") {
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 0,
          message: "Payment not completed",
          payload: { payment_status: intent.status },
        });
      }

      const charge = intent.charges.data[0];

      await paymentModel.createPayment({
        user_id,
        doctor_id,
        appointment_id,
        payment_method: charge.payment_method_details.type,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        payment_intent_id: intent.id,
        charge_id: charge.id,
        customer_id: intent.customer,
        receipt_url: charge.receipt_url,
      });

      // Mark invoice and appointment as paid
      await db.query(
        `UPDATE invoices SET status = 'paid' WHERE appointment_id = ?`,
        [appointment_id]
      );
      await db.query(
        `UPDATE appointments SET payment_status = 'paid' WHERE id = ?`,
        [appointment_id]
      );

      return apiResponse(res, {
        code: 200,
        status: 1,
        message: "Payment verified and saved",
      });
    } catch (err) {
      console.error("Verify payment error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};

export default paymentController;
