export const schema = [
  `CREATE TABLE IF NOT EXISTS privacy_policy (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  `CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    user_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    last_login DATE,
    last_ip VARCHAR(45),
    prefix ENUM('Mr', 'Mrs', 'Ms', 'Dr') DEFAULT 'Mr',
    phone VARCHAR(20) NOT NULL,
    phone_code VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    role ENUM('superadmin', 'admin') DEFAULT 'admin',
    status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prefix ENUM('Mr', 'Mrs', 'Ms', 'Dr') DEFAULT 'Mr',
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    user_name VARCHAR(255),
    status ENUM('1', '2', '3') DEFAULT '1', -- 1: Active, 2: Inactive, 3: Pending
    is_approved BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    phone_code VARCHAR(20),
    last_login DATE,
    last_ip VARCHAR(45),
    role ENUM('doctor','patient') DEFAULT 'patient',
    DOB DATE,
    bio TEXT,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    gender ENUM('male','female','other') DEFAULT 'male',
    clinic_id INT,

    -- Address (optional at registration)
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pin_code VARCHAR(20),
    
    -- Consultation
    consultation_fee_type ENUM('free', 'paid') DEFAULT 'free',
    consultation_fee DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT UNIQUE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  `CREATE TABLE IF NOT EXISTS specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('1', '2') DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS doctor_specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    specialization_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('1', '2') DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('1', '2') DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS doctor_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    services_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('1', '2') DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year_of_passing YEAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
)`,

`CREATE TABLE IF NOT EXISTS experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  hospital VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  currently_working BOOLEAN DEFAULT 0,
  end_date DATE DEFAULT NULL, -- NULL if currently working
  designation VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,

  `CREATE TABLE IF NOT EXISTS awards (
     id INT AUTO_INCREMENT PRIMARY KEY,
     doctor_id INT NOT NULL,
     title VARCHAR(255) NOT NULL,
     year INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  `CREATE TABLE IF NOT EXISTS memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
 )`,

  `CREATE TABLE IF NOT EXISTS doctor_registration (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      registration_number VARCHAR(255) NOT NULL UNIQUE,
      registration_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  `CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_id INT NOT NULL,
  caregiver_id INT,
  clinic_id INT,
  appointment_date DATETIME NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type ENUM('home_visit', 'clinic_visit', 'video', 'phone') DEFAULT 'clinic_visit',
  appointment_type ENUM('free', 'paid') DEFAULT 'free',
  payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'INR',
  prescription TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
)`,

`CREATE TABLE IF NOT EXISTS appointment_address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  is_caregiver BOOLEAN DEFAULT FALSE,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  pin_code VARCHAR(20),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
)`,

`CREATE TABLE IF NOT EXISTS appointment_reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  created_by_user_id INT NOT NULL,
  created_by_role ENUM('doctor', 'patient', 'admin') NOT NULL,
  reminder_time DATETIME NOT NULL,
  reminder_type ENUM('email', 'sms', 'push') DEFAULT 'email',
  status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS appointment_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note TEXT NOT NULL,
  appointment_id INT NOT NULL,
  created_by_user_id INT NOT NULL,
  created_by_role ENUM('doctor', 'patient', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS clinic (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS clinic_doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinic_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS doctor_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  
  -- Consultation Type
  consultation_type ENUM('clinic_visit', 'home_visit', 'video', 'phone') NOT NULL,
  
  -- Optional Clinic (only for clinic visits)
  clinic_id INT,
  
  -- Weekly schedule
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INT NOT NULL, -- in minutes

  status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinic(id) ON DELETE CASCADE
)`,

`CREATE TABLE IF NOT EXISTS doctor_unavailability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  from_time TIME, -- optional
  to_time TIME,   -- optional
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
)`,

  `CREATE TABLE IF NOT EXISTS patient_caregiver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    phone_code VARCHAR(20),
    relationship ENUM('family', 'friend', 'professional') DEFAULT 'family',
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pin_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS patient_to_caregiver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    status ENUM('1', '2') DEFAULT '1', -- 1: Active, 2: Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS appointment_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  changed_by ENUM('doctor', 'admin', 'patient'),
  previous_status ENUM('pending', 'confirmed', 'cancelled', 'completed'),
  new_status ENUM('pending', 'confirmed', 'cancelled', 'completed'),
  reason TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id)
 )`,

  `CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  appointment_id INT NOT NULL,
  user_id INT NOT NULL,
  doctor_id INT NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  pdf_url VARCHAR(255), -- optional: if invoice is stored as PDF
  status ENUM('generated', 'sent', 'paid') DEFAULT 'generated',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
)`,

  `CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  doctor_id INT,
  appointment_id INT,

  -- Gateway & Method
  payment_method ENUM('card', 'upi', 'wallet', 'cash') DEFAULT 'card',

  -- Payment Details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('pending', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',

  -- Stripe Specific Fields
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  receipt_url VARCHAR(255),

  -- Manual Refund Tracking (optional)
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_reason TEXT,

  -- Timestamps
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign Keys
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
)`,

`CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  message TEXT,
  type ENUM('email', 'sms', 'push', 'system') DEFAULT 'email',
  status ENUM('unread', 'read') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

`CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  status ENUM('open', 'resolved', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`,
];
