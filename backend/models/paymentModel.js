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
  },
  findOne: async (data) => {
    const [rows] = await db.query(
      `SELECT * FROM payments WHERE appointment_id = ? LIMIT 1`,
      [data.appointment_id]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

export default paymentModel;