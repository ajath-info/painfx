import { db } from "../config/db.js";

const paymentModel = {
  createPayment: async (data) => {
    const [result] = await db.query(
      `INSERT INTO payments (
        user_id, doctor_id, appointment_id,
        payment_method, amount, currency, status,
        stripe_payment_intent_id, stripe_charge_id,
        stripe_customer_id, receipt_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.doctor_id,
        data.appointment_id,
        data.payment_method,
        data.amount,
        data.currency,
        data.status,
        data.payment_intent_id,
        data.charge_id,
        data.customer_id,
        data.receipt_url,
      ]
    );
    return result.insertId;
  }
};

export default paymentModel;
