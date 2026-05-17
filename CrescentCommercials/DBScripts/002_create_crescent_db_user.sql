-- Run this as a MySQL administrator account.
CREATE USER IF NOT EXISTS 'crescent_db_user'@'localhost' IDENTIFIED BY 'crescent';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON crescent_commercials.* TO 'crescent_db_user'@'localhost';
FLUSH PRIVILEGES;
