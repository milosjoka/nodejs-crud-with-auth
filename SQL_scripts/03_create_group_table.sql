CREATE TABLE groups
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions VARCHAR(50)[]
);
