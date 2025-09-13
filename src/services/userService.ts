import { pool } from "../config/db";

export const getAllUsers = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
};

export const addUser = async (name: string, email: string) => {
    const result = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
    );
    return result.rows[0];
};
