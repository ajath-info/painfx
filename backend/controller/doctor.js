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
        const [existing] = await db.query(
          `SELECT id FROM services WHERE name = ?`,
          [name]
        );
        if (existing.length > 0) {
          srvId = existing[0].id;
        } else {
          const [result] = await db.query(
            `INSERT INTO services (name) VALUES (?)`,
            [name]
          );
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
      } else if (mapped[0].status === "2") {
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

  //-------------------------------Education crud-------------------------------

  //Add single or multiple educations
  addEducations: async (req, res) => {
    const doctor_id = req.user.id;
    let { educations } = req.body;
    console.log("Received educations:", educations);
    try {
      if (!educations) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Education data is required",
        });
      }

      // Convert to array if only single object is passed
      if (!Array.isArray(educations)) {
        educations = [educations];
      }

      for (const edu of educations) {
        let { degree, institution, year_of_passing } = edu;
        degree = degree?.trim();
        institution = institution?.trim();
        year_of_passing = year_of_passing ? parseInt(year_of_passing) : null;

        if (!degree || !institution || !year_of_passing) continue;

        await db.query(
          `INSERT INTO educations (doctor_id, degree, institution, year_of_passing) VALUES (?, ?, ?, ?)`,
          [doctor_id, degree.trim(), institution.trim(), year_of_passing]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education(s) added successfully",
      });
    } catch (error) {
      console.error("Error adding educations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add educations",
      });
    }
  },

  updateEducation: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;
    const { degree, institution, year_of_passing } = req.body;

    try {
      const [existing] = await db.query(
        `SELECT id FROM educations WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Education record not found",
        });
      }

      await db.query(
        `UPDATE educations SET degree = ?, institution = ?, year_of_passing = ?, updated_at = NOW() WHERE id = ? AND doctor_id = ?`,
        [degree?.trim(), institution?.trim(), year_of_passing, id, doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education updated successfully",
      });
    } catch (error) {
      console.error("Error updating education:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update education",
      });
    }
  },

  deleteEducation: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;

    try {
      const [existing] = await db.query(
        `SELECT id FROM educations WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Education record not found",
        });
      }

      await db.query(`DELETE FROM educations WHERE id = ? AND doctor_id = ?`, [
        id,
        doctor_id,
      ]);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete education",
      });
    }
  },

  getEducations: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT id, degree, institution, year_of_passing, created_at, updated_at FROM educations WHERE doctor_id = ? ORDER BY year_of_passing DESC`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching educations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch educations",
      });
    }
  },

  //-------------------------------Experience crud-------------------------------
  addExperiences: async (req, res) => {
    const doctor_id = req.user.id;
    let { experiences } = req.body;

    try {
      if (!experiences) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Experience data is required",
        });
      }

      if (!Array.isArray(experiences)) {
        experiences = [experiences];
      }

      for (const exp of experiences) {
        const {
          hospital,
          start_date,
          end_date,
          currently_working,
          designation,
        } = exp;

        if (!hospital || !start_date || !designation) continue;

        const isCurrentlyWorking =
          !!currently_working || currently_working === "true";
        const parsedEndDate = isCurrentlyWorking ? null : end_date || null;

        await db.query(
          `INSERT INTO experiences (
          doctor_id, hospital, start_date, end_date, currently_working, designation
        ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            doctor_id,
            hospital.trim(),
            start_date,
            parsedEndDate,
            isCurrentlyWorking ? 1 : 0,
            designation.trim(),
          ]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience(s) added successfully",
      });
    } catch (error) {
      console.error("Error adding experiences:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add experiences",
      });
    }
  },

  updateExperience: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;
    const { hospital, start_date, end_date, currently_working, designation } =
      req.body;

    try {
      const [existing] = await db.query(
        `SELECT id FROM experiences WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );

      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Experience record not found",
        });
      }

      // Convert and validate values
      const isCurrentlyWorking =
        currently_working === true ||
        currently_working === "true" ||
        currently_working === 1 ||
        currently_working === "1";

      const parsedEndDate = isCurrentlyWorking ? null : end_date || null;

      await db.query(
        `UPDATE experiences
       SET hospital = ?, start_date = ?, end_date = ?, currently_working = ?, designation = ?, updated_at = NOW()
       WHERE id = ? AND doctor_id = ?`,
        [
          hospital?.trim(),
          start_date,
          parsedEndDate,
          isCurrentlyWorking ? 1 : 0,
          designation?.trim(),
          id,
          doctor_id,
        ]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience updated successfully",
      });
    } catch (error) {
      console.error("Error updating experience:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update experience",
      });
    }
  },

  deleteExperience: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;

    try {
      const [existing] = await db.query(
        `SELECT id FROM experiences WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Experience record not found",
        });
      }

      await db.query(`DELETE FROM experiences WHERE id = ? AND doctor_id = ?`, [
        id,
        doctor_id,
      ]);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting experience:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete experience",
      });
    }
  },

  getExperiences: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT id, hospital, start_date, end_date, currently_working, designation, created_at, updated_at
       FROM experiences
       WHERE doctor_id = ?
       ORDER BY start_date DESC`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching experiences:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch experiences",
      });
    }
  },

  // -------------------------------awards crud-------------------------------
  addAwards: async (req, res) => {
    const doctor_id = req.user.id;
    let { awards } = req.body;

    try {
      if (!awards)
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Awards required",
        });
      if (!Array.isArray(awards)) awards = [awards];

      for (const award of awards) {
        const { title, year } = award;
        if (
          !title ||
          !year ||
          isNaN(year) ||
          year < 1900 ||
          year > new Date().getFullYear()
        )
          continue;
        await db.query(
          `INSERT INTO awards (doctor_id, title, year) VALUES (?, ?, ?)`,
          [doctor_id, title.trim(), year]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Awards added successfully",
      });
    } catch (error) {
      console.error("Error adding awards:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add awards",
      });
    }
  },

  getAwards: async (req, res) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM awards WHERE doctor_id = ? ORDER BY year DESC`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get awards",
      });
    }
  },

  deleteAward: async (req, res) => {
    try {
      await db.query(`DELETE FROM awards WHERE id = ? AND doctor_id = ?`, [
        req.params.id,
        req.user.id,
      ]);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Award deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete award",
      });
    }
  },

  //------------------------------membership crud----------------------------
  addMemberships: async (req, res) => {
    const doctor_id = req.user.id;
    let { memberships } = req.body;

    try {
      if (!memberships)
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Memberships required",
        });
      if (!Array.isArray(memberships)) memberships = [memberships];

      for (const m of memberships) {
        if (!m.text) continue;
        await db.query(
          `INSERT INTO memberships (doctor_id, text) VALUES (?, ?)`,
          [doctor_id, m.text.trim()]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Memberships added successfully",
      });
    } catch (error) {
      console.error("Error adding memberships:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add memberships",
      });
    }
  },

  getMemberships: async (req, res) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM memberships WHERE doctor_id = ?`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get memberships",
      });
    }
  },

  deleteMembership: async (req, res) => {
    try {
      await db.query(`DELETE FROM memberships WHERE id = ? AND doctor_id = ?`, [
        req.params.id,
        req.user.id,
      ]);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Membership deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete membership",
      });
    }
  },

  //----------------------------registration----------------------------------
  addDoctorRegistration: async (req, res) => {
    const doctor_id = req.user.id;
    const { registration_number, registration_date } = req.body;

    if (!registration_number || !registration_date) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Registration number and date are required",
      });
    }

    try {
      const [existing] = await db.query(
        `SELECT id FROM doctor_registration WHERE doctor_id = ?`,
        [doctor_id]
      );
      if (existing.length > 0) {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Registration already exists",
        });
      }

      await db.query(
        `INSERT INTO doctor_registration (doctor_id, registration_number, registration_date) VALUES (?, ?, ?)`,
        [doctor_id, registration_number.trim(), registration_date]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Doctor registration added",
      });
    } catch (error) {
      console.error("Error adding doctor registration:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add registration",
      });
    }
  },

  getDoctorRegistration: async (req, res) => {
    try {
      const [result] = await db.query(
        `SELECT * FROM doctor_registration WHERE doctor_id = ?`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: result[0] || null,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get registration",
      });
    }
  },

  deleteDoctorRegistration: async (req, res) => {
    try {
      const id = req.params.id;
      await db.query(`DELETE FROM doctor_registration WHERE doctor_id = ? And id = ?`, [
        req.user.id, id
      ]);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Registration deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete registration",
      });
    }
  },
};

export default doctorController;
