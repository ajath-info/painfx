export const schema = [
  `CREATE TABLE IF NOT EXISTS privacy_policy (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  `CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    status ENUM('1', '2', '3') DEFAULT '3', -- 1: Active, 2: Inactive, 3: Pending
    is_verified BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    DOB DATE,
    bio TEXT,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    gender ENUM('male','female','other') DEFAULT 'male',
    
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
  `CREATE TABLE IF NOT EXISTS specializations_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    type ENUM('1', '2') DEFAULT '1', -- 1: Specialization, 2: Service
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
)`,
  `CREATE TABLE IF NOT EXISTS educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year_of_passing YEAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
)`,
  `CREATE TABLE IF NOT EXISTS experiences (
       id INT AUTO_INCREMENT PRIMARY KEY,
       doctor_id INT NOT NULL,
       hospital VARCHAR(255) NOT NULL,
       from VARCHAR(255) NOT NULL,
       to YEAR NOT NULL,
       designation VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    )`,
  `CREATE TABLE IF NOT EXISTS awards (
     id INT AUTO_INCREMENT PRIMARY KEY,
     doctor_id INT NOT NULL,
     title VARCHAR(255) NOT NULL,
     year INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    )`,
  `CREATE TABLE IF NOT EXISTS memberships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      text VARCHAR(255) NOT NULL,
    )`,
  `CREATE TABLE IF NOT EXISTS Doctor_registration (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      registration_number VARCHAR(255) NOT NULL UNIQUE,
      registration_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    appointment_time TIME NOT NULL,
    amount DECIMAL(10,2), -- e.g., consultation fee
    appointment_address_id INT NOT NULL, -- e.g., address ID for the appointment
    appointment_location VARCHAR(255) NOT NULL, -- e.g., hospital, clinic, home
    appointment_type ENUM('1', '2') DEFAULT '1',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )`,
    `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    status ENUM('1', '2', '3') DEFAULT '1', -- 1: Active, 2: Inactive, 3: Pending
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    DOB DATE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    gender ENUM('male','female','other') DEFAULT 'male',
    preferred_doctor_id INT,

    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pin_code VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
];
