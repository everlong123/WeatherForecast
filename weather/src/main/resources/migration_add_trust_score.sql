-- Migration script: Thêm trust_score column vào bảng users
-- Chạy script này nếu database đã tồn tại và chưa có column trust_score

USE weather_db;

-- Kiểm tra và thêm column trust_score nếu chưa tồn tại
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'weather_db' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'trust_score'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE users ADD COLUMN trust_score INT NOT NULL DEFAULT 0 AFTER enabled',
    'SELECT "Column trust_score already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật trust_score cho các user hiện có (nếu chưa có giá trị)
UPDATE users 
SET trust_score = 0 
WHERE trust_score IS NULL;

SELECT 'Migration completed: trust_score column added successfully' AS result;

