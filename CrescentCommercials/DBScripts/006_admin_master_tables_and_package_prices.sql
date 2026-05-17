USE crescent_commercials;

CREATE TABLE IF NOT EXISTS master_bases (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master_base_types (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master_packs (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master_pack_sizes (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS business_unit_supported_bases (
  business_unit_id BIGINT NOT NULL,
  base_id BIGINT NOT NULL,
  PRIMARY KEY (business_unit_id, base_id),
  CONSTRAINT fk_bu_base_unit FOREIGN KEY (business_unit_id) REFERENCES business_units(id) ON DELETE CASCADE,
  CONSTRAINT fk_bu_base_base FOREIGN KEY (base_id) REFERENCES master_bases(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS business_unit_supported_base_types (
  business_unit_id BIGINT NOT NULL,
  base_type_id BIGINT NOT NULL,
  PRIMARY KEY (business_unit_id, base_type_id),
  CONSTRAINT fk_bu_type_unit FOREIGN KEY (business_unit_id) REFERENCES business_units(id) ON DELETE CASCADE,
  CONSTRAINT fk_bu_type_type FOREIGN KEY (base_type_id) REFERENCES master_base_types(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS business_unit_supported_packs (
  business_unit_id BIGINT NOT NULL,
  pack_id BIGINT NOT NULL,
  PRIMARY KEY (business_unit_id, pack_id),
  CONSTRAINT fk_bu_pack_unit FOREIGN KEY (business_unit_id) REFERENCES business_units(id) ON DELETE CASCADE,
  CONSTRAINT fk_bu_pack_pack FOREIGN KEY (pack_id) REFERENCES master_packs(id) ON DELETE RESTRICT
);

ALTER TABLE product_package_sizes
  ADD COLUMN price DECIMAL(12,2) NULL,
  ADD COLUMN price_display VARCHAR(80) NULL;

INSERT IGNORE INTO master_bases (name, sort_order) VALUES
('N/A', 1), ('Wax', 2), ('Acrylic', 3), ('Polyurethane', 4);

INSERT IGNORE INTO master_base_types (name, sort_order) VALUES
('N/A', 1), ('Solid', 2), ('Liquid', 3), ('Semi Solid', 4);

INSERT IGNORE INTO master_packs (name, sort_order) VALUES
('Direct', 1), ('Small Bag', 2), ('Medium Bag', 3), ('Carton', 4), ('Container', 5);

INSERT IGNORE INTO master_pack_sizes (name, sort_order) VALUES
('10', 1), ('50', 2), ('100', 3), ('1000', 4), ('10K', 5),
('100g', 6), ('500g', 7), ('1000g', 8), ('100ml', 9), ('1000ml', 10),
('1L', 11), ('2L', 12), ('4L', 13), ('5L', 14), ('6L', 15),
('Small', 16), ('Medium', 17), ('Big', 18), ('Very Big', 19), ('20', 20);
