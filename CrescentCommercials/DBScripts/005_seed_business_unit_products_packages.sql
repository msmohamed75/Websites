USE crescent_commercials;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_features;
TRUNCATE TABLE product_package_sizes;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO products (id, business_unit_id, product_name, category, sub_category, description, price, price_display, offers, image_url, sort_order, is_active) VALUES
(1, 1, 'Wax Polish', 'Solid', NULL, 'Wax polish solid category.', NULL, NULL, NULL, 'assets/products/WaxPolish.png', 1, TRUE),
(2, 1, 'Wax Polish', 'Solvent', NULL, 'Wax polish solvent category.', NULL, NULL, NULL, 'assets/products/golden-horse-wax-polish.png', 2, TRUE),
(3, 1, 'Wax Polish', 'Liquid', NULL, 'Wax polish liquid category.', NULL, NULL, NULL, 'assets/products/Cera%20Fluida.png', 3, TRUE),
(4, 1, 'Cera Fluida', 'Liquid', NULL, 'Cera Fluida liquid polish.', NULL, NULL, NULL, 'assets/products/Cera%20Fluida.png', 4, TRUE),
(5, 1, 'Creamora Leather Cream P1', 'Liquid', NULL, 'Creamora leather cream P1.', NULL, NULL, NULL, 'assets/products/Creamora_PremiumLeatherCream_1L%20P1_S.png', 5, TRUE),
(6, 2, 'Saram', 'Cracker', NULL, 'Fire cracker saram product line.', NULL, NULL, NULL, 'assets/products/fireworks/fireworks_product.png', 6, TRUE),
(7, 2, 'Flower Pot', 'Light', NULL, 'Flower pot fireworks product line.', NULL, NULL, NULL, 'assets/products/fireworks/fireworks_product.png', 7, TRUE),
(8, 2, 'Rocket Shots', 'Sky Light', NULL, 'Rocket shots fireworks product line.', NULL, NULL, NULL, 'assets/products/fireworks/fireworks_product.png', 8, TRUE);

INSERT INTO product_package_sizes (product_id, sort_order, package_size) VALUES
(1, 1, '100g'), (1, 2, '500g'), (1, 3, '1000g'),
(2, 1, '100ml'), (2, 2, '1000ml'),
(3, 1, '1L'), (3, 2, '2L'), (3, 3, '4L'), (3, 4, '5L'),
(4, 1, '1L'), (4, 2, '2L'),
(5, 1, '4L'), (5, 2, '6L'),
(6, 1, '100'), (6, 2, '1000'), (6, 3, '10000'),
(7, 1, 'Small'), (7, 2, 'Medium'), (7, 3, 'Big'), (7, 4, 'Very Big'),
(8, 1, '20'), (8, 2, '50'), (8, 3, '100');

INSERT INTO product_features (product_id, sort_order, feature) VALUES
(1, 1, 'Solid'),
(2, 1, 'Solvent'),
(3, 1, 'Liquid'),
(4, 1, 'Liquid'),
(5, 1, 'Liquid'),
(6, 1, 'Cracker'),
(7, 1, 'Light'),
(8, 1, 'Sky Light');
