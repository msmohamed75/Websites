USE crescent_commercials;

CREATE TABLE IF NOT EXISTS product_package_sizes (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  package_size VARCHAR(120) NOT NULL,
  CONSTRAINT fk_product_package_sizes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
