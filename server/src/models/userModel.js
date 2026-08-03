import pool from "../config/db.js";

// Find user by email
export const findUserByEmailModel = async (email, connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );
  return rows[0];
};

// Create a new user
export const createUserModel = async (data, connection = pool) => {
  const { first_name, last_name, email, password, role } = data;
  const [result] = await connection.query(
    `
    INSERT INTO users (first_name, last_name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
    `,
    [first_name, last_name, email, password, role || "user"]
  );
  return result;
};

// Find user by ID (needed for auth middleware)
export const findUserByIdModel = async (id, connection = pool) => {
  const [rows] = await connection.query(
    `
    SELECT id, first_name, last_name, email, role, created_at, updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );
  return rows[0];
};
