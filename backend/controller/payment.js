import stripe from "../config/strip.js";
import paymentModel from "../models/paymentModel.js";
import { apiResponse } from "../utils/helper.js";
import { db } from "../config/db.js";
import * as DOTENV from "../utils/dotEnv.js";

const paymentController = {
  // 1. Create Stripe Checkout Session
createCheckoutSession: async (req, res) => {
  try {
    const { amount, appointment_id, doctor_id } = req.body;
    const user_id = req.user.id;

    if (!amount || !appointment_id || !doctor_id) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Missing required fields",
      });
    }

    // ✅ Fetch patient's full_name
    const [[user]] = await db.query(`SELECT full_name FROM users WHERE id = ?`, [user_id]);
    const patientName = user?.full_name || `Patient #${user_id}`;

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "AUD",
            product_data: {
              name: `Appointment for ${patientName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id,
        doctor_id,
        appointment_id,
      },
      success_url: `${DOTENV.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOTENV.FRONTEND_URL}/payment-cancelled`,
    });

    return apiResponse(res, {
      code: 200,
      status: 1,
      message: "Checkout session created",
      payload: {
        sessionUrl: session.url,
        sessionId: session.id,
      },
    });
  } catch (err) {
    console.error("Checkout session error:", err.message);
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: "Failed to create checkout session",
    });
  }
},


  // 2. Verify Stripe Session and Save Payment
  verifySessionAndSave: async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 0,
        message: "Payment not completed",
        payload: { status: session.payment_status },
      });
    }

    const intent = session.payment_intent;
    const chargeId = intent.latest_charge;
    const metadata = session.metadata;

    // ✅ fetch charge using ID instead of relying on expand
    const charge = await stripe.charges.retrieve(chargeId);

    // Check if a payment already exists for the appointment_id
    const existingPayment = await paymentModel.findOne({ appointment_id: metadata.appointment_id });
    let paymentId;

    if (!existingPayment) {
      // Create new payment only if no existing payment is found
      paymentId = await paymentModel.createPayment({
        user_id: metadata.user_id,
        doctor_id: metadata.doctor_id,
        appointment_id: metadata.appointment_id,
        payment_method: charge.payment_method_details?.type || "unknown",
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        payment_intent_id: intent.id,
        charge_id: charge.id,
        customer_id: intent.customer,
        receipt_url: charge.receipt_url,
      });
    } else {
      paymentId = existingPayment.id; // Use existing payment ID
    }

    // Update invoice with status and payment_id
    await db.query(
      `UPDATE invoices SET status = 'paid', payment_id = ? WHERE appointment_id = ? AND status != 'paid'`,
      [paymentId, metadata.appointment_id]
    );
    await db.query(
      `UPDATE appointments SET payment_status = 'paid' WHERE id = ? AND payment_status != 'paid'`,
      [metadata.appointment_id]
    );

    return apiResponse(res, {
      code: 200,
      status: 1,
      message: "Session verified and payment saved",
    });
  } catch (err) {
    console.error("Verify session error:", err);
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
