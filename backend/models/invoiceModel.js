import { db } from "../config/db.js";

async function generateInvoiceNumber() {
  const [rows] = await db.query(`SELECT COUNT(*) as count FROM invoices`);
  const count = rows[0].count + 1;
  const padded = String(count).padStart(5, "0");
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `INV-${today}-${padded}`;
}

const invoiceModel = {
  createInvoice: async ({
    appointment_id,
    user_id,
    doctor_id,
    total_amount,
    payment_status,
  }) => {
    const invoice_number = await generateInvoiceNumber();
    const status = payment_status === "paid" ? "paid" : "generated";

    const [result] = await db.query(
      `INSERT INTO invoices (
        invoice_number, appointment_id, user_id, doctor_id,
        total_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [invoice_number, appointment_id, user_id, doctor_id, total_amount, status]
    );

    return result.insertId;
  },

  getByAppointment: async (appointment_id) => {
    const [[invoice]] = await db.query(
      `SELECT 
       i.*, 
       u.full_name AS user_name, u.profile_image AS user_profile,
       d.full_name AS doctor_name, d.profile_image AS doctor_profile,
       p.paid_at
     FROM invoices i
     LEFT JOIN users u ON u.id = i.user_id
     LEFT JOIN users d ON d.id = i.doctor_id
     LEFT JOIN payments p ON p.id = i.payment_id
     WHERE i.appointment_id = ?`,
      [appointment_id]
    );
    return invoice;
  },

  getByUserId: async (user_id, page, limit) => {
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM invoices WHERE user_id = ?`,
      [user_id]
    );

    const [invoices] = await db.query(
      `SELECT 
       i.*, 
       u.full_name AS user_name, u.profile_image AS user_profile,
       d.full_name AS doctor_name, d.profile_image AS doctor_profile,
       p.paid_at
     FROM invoices i
     LEFT JOIN users u ON u.id = i.user_id
     LEFT JOIN users d ON d.id = i.doctor_id
     LEFT JOIN payments p ON p.id = i.payment_id
     WHERE i.user_id = ?
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );

    return { data: invoices, total };
  },

  getByDoctorId: async (doctor_id, page, limit) => {
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM invoices WHERE doctor_id = ?`,
      [doctor_id]
    );

    const [invoices] = await db.query(
      `SELECT 
       i.*, 
       u.full_name AS user_name, u.profile_image AS user_profile,
       d.full_name AS doctor_name, d.profile_image AS doctor_profile,
       p.paid_at
     FROM invoices i
     LEFT JOIN users u ON u.id = i.user_id
     LEFT JOIN users d ON d.id = i.doctor_id
     LEFT JOIN payments p ON p.id = i.payment_id
     WHERE i.doctor_id = ?
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
      [doctor_id, limit, offset]
    );

    return { data: invoices, total };
  },

  getFiltered: async ({ start_date, end_date, status, page, limit }) => {
    const offset = (page - 1) * limit;
    const params = [];

    let filterQuery = `WHERE 1=1`;

    if (start_date) {
      filterQuery += ` AND i.invoice_date >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      filterQuery += ` AND i.invoice_date <= ?`;
      params.push(end_date);
    }

    if (status) {
      filterQuery += ` AND i.status = ?`;
      params.push(status);
    }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM invoices i ${filterQuery}`,
      params
    );

    const [invoices] = await db.query(
      `SELECT 
       i.*, 
       u.full_name AS user_name, u.profile_image AS user_profile,
       d.full_name AS doctor_name, d.profile_image AS doctor_profile,
       p.paid_at
     FROM invoices i
     LEFT JOIN users u ON u.id = i.user_id
     LEFT JOIN users d ON d.id = i.doctor_id
     LEFT JOIN payments p ON p.id = i.payment_id
     ${filterQuery}
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { data: invoices, total };
  },

  getAll: async (page, limit) => {
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM invoices`
    );

    const [invoices] = await db.query(
      `SELECT 
       i.*, 
       u.full_name AS user_name, u.profile_image AS user_profile,
       d.full_name AS doctor_name, d.profile_image AS doctor_profile,
       p.paid_at
     FROM invoices i
     LEFT JOIN users u ON u.id = i.user_id
     LEFT JOIN users d ON d.id = i.doctor_id
     LEFT JOIN payments p ON p.id = i.payment_id
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return { data: invoices, total };
  },

  updateStatus: async (id, status) => {
    await db.query(`UPDATE invoices SET status = ? WHERE id = ?`, [status, id]);
  },
};

export default invoiceModel;
