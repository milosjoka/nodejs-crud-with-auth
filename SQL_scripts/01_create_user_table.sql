CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);
