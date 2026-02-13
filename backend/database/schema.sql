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
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    category VARCHAR(100),
    quantity FLOAT,
    unit VARCHAR(20),
    threshold FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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


CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    status VARCHAR(50),
    created_at DATE
);

ALTER TABLE users
ADD COLUMN last_login_at TIMESTAMP NULL AFTER is_active;

/* ================= POWER PROJECTS ================= */

INSERT INTO power_projects 
(project_name, project_type, region, start_date, expected_end_date, project_status)
VALUES
('Western Grid Expansion','Transmission','Maharashtra','2025-01-01','2026-06-30','ONGOING'),
('North Substation Upgrade','Substation','Delhi','2025-03-15','2025-12-20','PLANNED'),
('Southern Line Extension','Transmission','Tamil Nadu','2024-05-10','2025-08-25','ONGOING'),
('Eastern Grid Modernization','Transmission','West Bengal','2024-07-01','2026-01-15','ONGOING'),
('Central Power Hub','Substation','Madhya Pradesh','2025-02-10','2025-11-30','PLANNED'),
('Rajasthan Solar Link','Transmission','Rajasthan','2024-09-05','2025-09-05','ONGOING'),
('UP Rural Electrification','Substation','Uttar Pradesh','2024-04-01','2025-04-01','COMPLETED'),
('Gujarat Smart Grid','Transmission','Gujarat','2025-06-01','2026-12-31','PLANNED'),
('Bihar Grid Strengthening','Substation','Bihar','2024-03-01','2025-03-01','DELAYED'),
('Karnataka High Voltage Line','Transmission','Karnataka','2025-01-20','2026-07-20','ONGOING');


/* ================= INVENTORY ITEMS ================= */

INSERT INTO inventory_items 
(name, category, quantity, unit, threshold)
VALUES
('Power Transformer 220kV','Transformer',20,'Units',5),
('Copper Cable 400mm','Cable',6000,'Meters',1000),
('Circuit Breaker','Switchgear',60,'Units',10),
('Insulator Disc','Hardware',3000,'Units',500),
('Current Transformer','Transformer',40,'Units',8),
('Voltage Regulator','Equipment',25,'Units',5),
('Steel Tower','Structure',150,'Units',20),
('Earthing Rod','Hardware',2000,'Units',300),
('Relay Panel','Control System',35,'Units',5),
('High Voltage Fuse','Protection',500,'Units',50);


/* ================= PROJECT INVENTORY REQUIREMENT ================= */

INSERT INTO project_inventory_requirement
(project_id, item_id, required_quantity, required_by_date)
VALUES
(1,1,5,'2025-04-01'),
(1,2,2000,'2025-05-15'),
(2,3,12,'2025-06-10'),
(3,4,600,'2025-07-20'),
(4,5,10,'2025-08-01'),
(5,6,8,'2025-09-15'),
(6,7,30,'2025-10-10'),
(7,8,500,'2025-03-01'),
(8,9,15,'2025-11-11'),
(9,10,100,'2025-02-28');


/* ================= INVENTORY STOCK ================= */

INSERT INTO inventory_stock
(item_id, location, quantity_available)
VALUES
(1,'Mumbai Warehouse',15),
(2,'Pune Storage',4000),
(3,'Delhi Depot',40),
(4,'Chennai Warehouse',2000),
(5,'Kolkata Depot',25),
(6,'Bhopal Storage',15),
(7,'Jaipur Warehouse',100),
(8,'Lucknow Depot',1500),
(9,'Ahmedabad Hub',20),
(10,'Patna Storage',300);


/* ================= DEMAND HISTORY ================= */

INSERT INTO demand_history
(item_id, project_id, demand_date, quantity_used)
VALUES
(1,1,'2024-10-01',3),
(2,1,'2024-11-15',1500),
(3,2,'2024-12-20',8),
(4,3,'2024-09-10',400),
(5,4,'2024-08-05',6),
(6,5,'2024-07-12',4),
(7,6,'2024-06-25',20),
(8,7,'2024-05-15',350),
(9,8,'2024-04-18',10),
(10,9,'2024-03-30',60);


/* ================= MAINTENANCE RECORDS ================= */

INSERT INTO maintenance_records
(item_id, maintenance_date, failure_type, downtime_hours)
VALUES
(1,'2024-08-12','Overheating',5),
(2,'2024-09-01','Insulation Damage',4),
(3,'2024-09-18','Mechanical Fault',3),
(4,'2024-10-10','Crack Damage',2),
(5,'2024-07-22','Calibration Issue',4),
(6,'2024-06-11','Voltage Fluctuation',6),
(7,'2024-05-30','Structural Damage',8),
(8,'2024-04-14','Corrosion',3),
(9,'2024-03-09','Relay Failure',5),
(10,'2024-02-20','Fuse Burnt',2);


/* ================= DEMAND FORECAST ================= */

INSERT INTO demand_forecast
(item_id, project_id, forecast_month, predicted_quantity, risk_level)
VALUES
(1,1,'2025-04-01',6,'MEDIUM'),
(2,1,'2025-05-01',2500,'HIGH'),
(3,2,'2025-06-01',15,'LOW'),
(4,3,'2025-07-01',700,'MEDIUM'),
(5,4,'2025-08-01',12,'LOW'),
(6,5,'2025-09-01',10,'MEDIUM'),
(7,6,'2025-10-01',35,'HIGH'),
(8,7,'2025-03-01',600,'LOW'),
(9,8,'2025-11-01',18,'MEDIUM'),
(10,9,'2025-02-01',120,'HIGH');


/* ================= REPORTS ================= */

INSERT INTO reports
(title, status, created_at)
VALUES
('Inventory Summary - Jan 2025','Generated','2025-01-31'),
('Demand Forecast - Q1','Generated','2025-03-31'),
('Project Status Report','Pending','2025-02-15'),
('Maintenance Analysis','Generated','2025-01-20'),
('Stock Threshold Alert','Pending','2025-03-10'),
('Regional Usage Report','Generated','2025-02-28'),
('Transmission Report','Pending','2025-01-25'),
('Substation Report','Generated','2025-02-05'),
('Risk Assessment Report','Generated','2025-03-18'),
('Annual Summary','Pending','2025-03-30');
