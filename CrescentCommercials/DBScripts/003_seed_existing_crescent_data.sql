USE crescent_commercials;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_features;
TRUNCATE TABLE products;
TRUNCATE TABLE business_unit_images;
TRUNCATE TABLE business_unit_features;
TRUNCATE TABLE business_units;
TRUNCATE TABLE home_topics;
TRUNCATE TABLE home_content;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO home_content (id, eyebrow, title, intro, mission_title, mission, image_url) VALUES
(1,
 'Premium Quality Products',
 'Who We Are',
 'Crescent Commercials is a diversified business delivering premium-quality consumer and commercial products across multiple categories including Wax Polish, Fireworks, Spices & Masala Products, and Clothing. We focus on quality, customer satisfaction, customization, and long-lasting relationships with retailers, wholesalers, and end customers.',
 'Our Mission',
 'Our mission is to provide reliable, high-quality products that enhance everyday living while maintaining exceptional standards in manufacturing, packaging, and customer service.',
 'assets/products/MasterImage.png');

INSERT INTO home_topics (home_content_id, sort_order, topic) VALUES
(1, 1, 'Quality That Shines Across Every Product'),
(1, 2, 'Trusted Products for Homes & Businesses'),
(1, 3, 'Premium Products, Crafted for Everyday Excellence'),
(1, 4, 'From Floors to Flavors - Quality You Can Trust');

INSERT INTO business_units (id, slug, name, icon, image_url, image_360_url, description, accent_color, is_coming_soon, sort_order, is_active) VALUES
(1, 'wax-polish', 'Wax Polish', '□', 'assets/products/MasterImage.png', NULL, 'Premium quality wax polish for all surfaces. Extra shine, long lasting protection.', '#f5a623', FALSE, 1, TRUE),
(2, 'fire-crackers', 'Fire Crackers', '✦', 'assets/products/fireworks/fireworks_product.png', NULL, 'Safe and high quality fireworks for all celebrations. Bright, safe, spectacular.', '#ff375f', TRUE, 2, TRUE),
(3, 'spices-masala', 'Spices & Masala', '☘', 'assets/products/SpicesMasla/spices_product.png', NULL, 'Pure and aromatic spices blended to perfection. Authentic taste, rich aroma.', '#22c55e', TRUE, 3, TRUE),
(4, 'clothing', 'Clothing', '⌘', 'assets/products/clothing/Clothing_Product.png', NULL, 'Comfortable and stylish clothing for all ages. Quality you can trust.', '#2f80ed', TRUE, 4, TRUE),
(5, 'fragrance-candles', 'Fragrance Candles', '◇', 'assets/products/candles/Candles_Product.png', NULL, 'Perfect Candles, Fragrance Candles', '#a855f7', TRUE, 5, TRUE);

INSERT INTO business_unit_features (business_unit_id, sort_order, feature) VALUES
(1, 1, 'Long Lasting Shine'), (1, 2, 'Water Resistant'), (1, 3, 'Premium Quality'),
(2, 1, 'Vibrant Colors'), (2, 2, 'Safe & Certified'), (2, 3, 'Eco Friendly'),
(3, 1, '100% Natural'), (3, 2, 'Rich Aroma'), (3, 3, 'No Preservatives'),
(4, 1, 'Premium Fabric'), (4, 2, 'Comfort Fit'), (4, 3, 'Trendy Designs'),
(5, 1, 'Perfect Gifting'), (5, 2, 'Premium Packaging'), (5, 3, 'Custom Options');

INSERT INTO business_unit_images (business_unit_id, image_url, alt_text, is_primary, is_360, sort_order) VALUES
(1, 'assets/products/MasterImage.png', 'Wax Polish', TRUE, FALSE, 1),
(2, 'assets/products/fireworks/fireworks_product.png', 'Fire Crackers', TRUE, FALSE, 1),
(3, 'assets/products/SpicesMasla/spices_product.png', 'Spices and Masala', TRUE, FALSE, 1),
(4, 'assets/products/clothing/Clothing_Product.png', 'Clothing', TRUE, FALSE, 1),
(5, 'assets/products/candles/Candles_Product.png', 'Fragrance Candles', TRUE, FALSE, 1);

INSERT INTO products (id, business_unit_id, product_name, category, sub_category, description, price, price_display, offers, image_url, sort_order, is_active) VALUES
(1, 1, 'Golden Horse Wax Polish', 'Wax Polish', NULL, 'Premium wax polish for marble, granite, red oxide, cement floors, wood furniture and artificial leather.', 120.00, '₹120.00', NULL, 'assets/products/WaxPolish.png', 1, TRUE),
(2, 1, 'Golden Horse Premium Wax Polish', 'Wax Polish', NULL, 'High gloss polish for everyday home and commercial use with a rich premium finish.', 130.00, '₹130.00', NULL, 'assets/products/golden-horse-wax-polish.png', 2, TRUE),
(3, 1, 'Liquid Floor Polish', 'Floor Polish', NULL, 'Ready-to-use liquid floor polish for marble, granite, red oxide, cement and mosaic surfaces.', 180.00, '₹180.00', NULL, 'assets/products/Cera%20Fluida.png', 3, TRUE),
(4, 1, 'Wood Floor Polish', 'Floor Polish', NULL, 'Special polish for wooden floors and furniture to restore rich shine and protection.', 160.00, '₹160.00', NULL, 'assets/products/Wood_FloorPolish.png', 4, TRUE),
(5, 1, 'Creamora Leather Cream P1', 'Leather Cream', NULL, 'Rich non-greasy leather cream that conditions leather and prevents drying, cracking and stiffening.', 220.00, '₹220.00', NULL, 'assets/products/Creamora_PremiumLeatherCream_1L%20P1_S.png', 5, TRUE),
(6, 1, 'Creamora Leather Cream P1/S', 'Leather Cream', NULL, 'Premium leather care cream for shoes, hand bags, wallets, sofas, interiors and accessories.', 260.00, '₹260.00', NULL, 'assets/products/Creamora_PremiumLeatherCream_4L%20P1_S.png', 6, TRUE),
(7, 1, 'Leather Polish Solvent Based', 'Leather Polish', NULL, 'Natural wax and solvent blend that restores colour and creates a high-gloss protective finish.', 240.00, '₹240.00', NULL, 'assets/products/Creamora_LeatherPolish_SolvenBased_1kg_Front.png', 7, TRUE),
(8, 1, 'Leather Polish Water Based', 'Leather Polish', NULL, 'Water-based emulsion designed to restore, protect and maintain the natural beauty of leather.', 210.00, '₹210.00', NULL, 'assets/products/Creamora_PremiumLeatherCream_4L_P1.png', 8, TRUE);

INSERT INTO product_features (product_id, sort_order, feature) VALUES
(1, 1, 'Superior Shine'), (1, 2, 'Long-Lasting Protection'), (1, 3, 'Easy Application'),
(2, 1, 'High Gloss'), (2, 2, 'Surface Protection'), (2, 3, 'Easy Buffing'),
(3, 1, 'Quick-Drying'), (3, 2, 'Wear Protection'), (3, 3, 'Easy Maintenance'),
(4, 1, 'Wood Safe'), (4, 2, 'Natural Shine'), (4, 3, 'Protective Layer'),
(5, 1, 'Deep Conditioning'), (5, 2, 'Non-Greasy'), (5, 3, 'Softens Leather'),
(6, 1, 'Colour Refresh'), (6, 2, 'Smooth Finish'), (6, 3, 'Premium Care'),
(7, 1, 'Deep Gloss'), (7, 2, 'Strong Protection'), (7, 3, 'Colour Restore'),
(8, 1, 'Eco Friendly'), (8, 2, 'Quick Drying'), (8, 3, 'Gentle Care');
