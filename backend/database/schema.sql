CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN') DEFAULT 'ADMIN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE power_projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    project_type VARCHAR(50), -- Transmission / Substation
    region VARCHAR(50),
    start_date DATE,
    expected_end_date DATE,
    project_status ENUM('PLANNED','ONGOING','COMPLETED','DELAYED')
);
CREATE TABLE inventory_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    equipment_rating VARCHAR(50),
    voltage_level VARCHAR(50),
    unit VARCHAR(20),
    reorder_level INT
);
CREATE TABLE project_inventory_requirement (
    requirement_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    item_id INT,
    required_quantity INT,
    required_by_date DATE,
    FOREIGN KEY (project_id) REFERENCES power_projects(project_id),
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);
CREATE TABLE inventory_stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    location VARCHAR(100),
    quantity_available INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);
CREATE TABLE demand_history (
    demand_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    project_id INT,
    demand_date DATE,
    quantity_used INT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id),
    FOREIGN KEY (project_id) REFERENCES power_projects(project_id)
);
CREATE TABLE maintenance_records (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    maintenance_date DATE,
    failure_type VARCHAR(100),
    downtime_hours INT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);
CREATE TABLE demand_forecast (
    forecast_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    project_id INT,
    forecast_month DATE,
    predicted_quantity INT,
    risk_level ENUM('LOW','MEDIUM','HIGH'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id),
    FOREIGN KEY (project_id) REFERENCES power_projects(project_id)
);



ALTER TABLE users
ADD COLUMN last_login_at TIMESTAMP NULL AFTER is_active;