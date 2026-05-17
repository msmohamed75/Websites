USE crescent_commercials;

CREATE TABLE IF NOT EXISTS product_package_images (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_package_size_id BIGINT NOT NULL,
  image_url LONGTEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_package_images_package
    FOREIGN KEY (product_package_size_id) REFERENCES product_package_sizes(id) ON DELETE CASCADE
);

CREATE INDEX ix_product_package_images_package_sort
  ON product_package_images (product_package_size_id, sort_order);
