INSERT INTO groups
(name, permissions)
VALUES
    ('Admin',  ARRAY ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']),
    ('User',  ARRAY ['READ', 'WRITE', 'UPLOAD_FILES']),
    ('Guest',  ARRAY ['READ']);
