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

  getFiltered: async ({
    start_date,
    end_date,
    status,
    page,
    limit,
    user,
  }) => {
    const offset = (page - 1) * limit;
    const params = [];
    const { id, role } = user || {};

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

    // Add clinic_id filter for clinic role
    if (role === "clinic" && id) {
      filterQuery += ` AND a.clinic_id = ?`;
      params.push(id);
    }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total 
     FROM invoices i 
     LEFT JOIN appointments a ON a.id = i.appointment_id 
     ${filterQuery}`,
      params
    );

    const [invoices] = await db.query(
      `SELECT 
      i.*, 
      u.full_name AS user_name, u.profile_image AS user_profile,
      d.full_name AS doctor_name, d.profile_image AS doctor_profile,
      p.paid_at
    FROM invoices i
    LEFT JOIN appointments a ON a.id = i.appointment_id
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

  getInvoiceFullDetails: async (invoiceId) => {
    const [rows] = await db.query(
      `
    SELECT 
      i.id AS invoice_id,
      i.invoice_number,
      i.invoice_date,
      i.total_amount,
      i.status,
      i.created_at AS invoice_created_at,
      
      -- Appointment Info
      a.id AS appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.consultation_type,
      a.amount AS appointment_amount,
      a.clinic_id,
      a.status AS appointment_status,

      -- Patient Info
      u.id AS patient_id,
      u.full_name AS patient_name,
      u.email AS patient_email,
      u.phone AS patient_phone,
      u.address_line1 AS patient_address1,
      u.address_line2 AS patient_address2,
      u.city AS patient_city,
      u.state AS patient_state,
      u.country AS patient_country,
      u.pin_code AS patient_pin_code,

      -- Doctor Info
      d.id AS doctor_id,
      d.full_name AS doctor_name,
      d.email AS doctor_email,
      d.phone AS doctor_phone,
      d.address_line1 AS doctor_address1,
      d.address_line2 AS doctor_address2,
      d.city AS doctor_city,
      d.state AS doctor_state,
      d.country AS doctor_country,
      d.pin_code AS doctor_pin_code,
      
      -- Clinic Info (if any)
      c.name AS clinic_name,
      c.address_line1 AS clinic_address1,
      c.address_line2 AS clinic_address2,
      c.city AS clinic_city,
      c.state AS clinic_state,
      c.country AS clinic_country,
      c.pin_code AS clinic_pin_code

    FROM invoices i
    INNER JOIN appointments a ON i.appointment_id = a.id
    INNER JOIN users u ON i.user_id = u.id
    INNER JOIN users d ON i.doctor_id = d.id
    LEFT JOIN clinic c ON a.clinic_id = c.id
    WHERE i.id = ?
    `,
      [invoiceId]
    );

    if (rows.length === 0) return null;

    const invoice = rows[0];

    // Fetch doctor's degrees (education)
    const [educations] = await db.query(
      `SELECT degree, institution, year_of_passing FROM educations WHERE doctor_id = ?`,
      [invoice.doctor_id]
    );

    // Fetch doctor’s specializations
    const [specializations] = await db.query(
      `SELECT s.name FROM doctor_specializations ds 
     JOIN specializations s ON s.id = ds.specialization_id 
     WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
      [invoice.doctor_id]
    );

    invoice.educations = educations;
    invoice.specializations = specializations.map((s) => s.name);

    return invoice;
  },
};

export default invoiceModel;
