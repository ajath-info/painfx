import { db } from "../config/db.js";
import moment from "moment";
import { apiResponse } from "../utils/helper.js";

const doctorController = {

  // -----------------------------Specialization crud-----------------------------

  // 1. Add or Map Specialization only docotr can add or mapped unique specilization
  addOrMapSpecialization: async (req, res) => {
    let { name, specialization_id } = req.body;
    const doctor_id = req.user.id;
    name = name?.trim();
    name = name?.toLowerCase();

    try {
      let spId;

      if (specialization_id) {
        spId = specialization_id;
      } else {
        const [existing] = await db.query(
          `SELECT id FROM specializations WHERE name = ?`,
          [name]
        );
        if (existing.length > 0) {
          spId = existing[0].id;
        } else {
          const [result] = await db.query(
            `INSERT INTO specializations (name) VALUES (?)`,
            [name]
          );
          spId = result.insertId;
        }
      }

      // Check mapping
      const [mapped] = await db.query(
        `SELECT id, status FROM doctor_specializations WHERE doctor_id = ? AND specialization_id = ?`,
        [doctor_id, spId]
      );

      if (mapped.length === 0) {
        await db.query(
          `INSERT INTO doctor_specializations (doctor_id, specialization_id, status) VALUES (?, ?, '1')`,
          [doctor_id, spId]
        );
      } else if (mapped[0].status === 0) {
        await db.query(
          `UPDATE doctor_specializations SET status = '1', updated_at = NOW() WHERE id = ?`,
          [mapped[0].id]
        );
      } else {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Specialization already added",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Specialization added successfully",
      });
    } catch (error) {
      console.error("Error adding/mapping specialization:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to map specialization",
      });
    }
  },

  // 2. Search Specializations
  searchSpecializations: async (req, res) => {
    let { search = "" } = req.query;
    search = search?.trim();
    search = search?.toLowerCase();

    try {
      const [results] = await db.query(
        `SELECT id, name FROM specializations WHERE name LIKE ? AND status = '1' ORDER BY name ASC`,
        [`%${search}%`]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error searching specializations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },

  // 3. Get Doctor's Specializations
  getDoctorSpecializations: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT ds.id, s.name, ds.specialization_id, ds.status, ds.created_at, ds.updated_at
         FROM doctor_specializations ds
         JOIN specializations s ON ds.specialization_id = s.id
         WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching doctor's specializations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },

  // 4. Remove Mapping (Hard Delete)
  removeSpecializationFromDoctor: async (req, res) => {
    const doctor_id = req.user.id;
    // map_id is the ID of the mapping in doctor_specializations
    const { map_id } = req.params;

    try {
      // Check if the mapping exists
      const [checkMapping] = await db.query(
        `SELECT id FROM doctor_specializations WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );
      if (checkMapping.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Specialization mapping not found",
        });
      }
      const [result] = await db.query(
        `DELETE FROM doctor_specializations WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Specialization mapping deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting specialization mapping:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete specialization mapping",
      });
    }
  },
  
  // -----------------------------services crud-----------------------------

addOrMapService: async (req, res) => {
  let { name, services_id } = req.body;
  const doctor_id = req.user.id;
  name = name?.trim()?.toLowerCase();

  try {
    let srvId;

    if (services_id) {
      srvId = services_id;
    } else {
      const [existing] = await db.query(`SELECT id FROM services WHERE name = ?`, [name]);
      if (existing.length > 0) {
        srvId = existing[0].id;
      } else {
        const [result] = await db.query(`INSERT INTO services (name) VALUES (?)`, [name]);
        srvId = result.insertId;
      }
    }

    const [mapped] = await db.query(
      `SELECT id, status FROM doctor_services WHERE doctor_id = ? AND services_id = ?`,
      [doctor_id, srvId]
    );

    if (mapped.length === 0) {
      await db.query(
        `INSERT INTO doctor_services (doctor_id, services_id, status) VALUES (?, ?, '1')`,
        [doctor_id, srvId]
      );
    } else if (mapped[0].status === '2') {
      await db.query(
        `UPDATE doctor_services SET status = '1', updated_at = NOW() WHERE id = ?`,
        [mapped[0].id]
      );
    } else {
      return apiResponse(res, {
        error: true,
        code: 409,
        status: 0,
        message: "Service already added",
      });
    }

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      message: "Service added successfully",
    });
  } catch (error) {
    console.error("Error adding/mapping service:", error);
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: "Failed to map service",
    });
  }
},

searchServices: async (req, res) => {
  let { search = "" } = req.query;
  search = search?.trim()?.toLowerCase();

  try {
    const [results] = await db.query(
      `SELECT id, name FROM services WHERE name LIKE ? AND status = '1' ORDER BY name ASC`,
      [`%${search}%`]
    );

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      payload: results,
    });
  } catch (error) {
    console.error("Error searching services:", error);
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch services",
    });
  }
},

getDoctorServices: async (req, res) => {
  const doctor_id = req.user.id;

  try {
    const [results] = await db.query(
      `SELECT ds.id, s.name, ds.services_id, ds.status, ds.created_at, ds.updated_at
       FROM doctor_services ds
       JOIN services s ON ds.services_id = s.id
       WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
      [doctor_id]
    );

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      payload: results,
    });
  } catch (error) {
    console.error("Error fetching doctor's services:", error);
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch services",
    });
  }
},

removeServiceFromDoctor: async (req, res) => {
  const doctor_id = req.user.id;
  const { map_id } = req.params;

  try {
    const [checkMapping] = await db.query(
      `SELECT id FROM doctor_services WHERE id = ? AND doctor_id = ?`,
      [map_id, doctor_id]
    );

    if (checkMapping.length === 0) {
      return apiResponse(res, {
        error: true,
        code: 404,
        status: 0,
        message: "Service mapping not found",
      });
    }

    await db.query(
      `DELETE FROM doctor_services WHERE id = ? AND doctor_id = ?`,
      [map_id, doctor_id]
    );

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      message: "Service mapping deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service mapping:", error);
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: "Failed to delete service mapping",
    });
  }
},

};

export default doctorController;
