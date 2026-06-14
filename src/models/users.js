import db from "./db.js";

// Import the bcrypt library
import bcrypt from "bcrypt";

// Insert a new user into the database
const createUser = async (name, email, passwordHash) => {
    const default_role = "user";
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3,(SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id
    `;

    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if(result.rows.length === 0) {
        throw new Error("Failed to create user");
    }

        if(process.env.ENABLE_SQL_LOGGING === "true") {
            console.log("Create new user with ID:", result.rows[0].user_id);
        }

        return result.rows[0].user_id;
};


// Find user by email
const findUserByEmail = async (email) => {
    // Update the session to include the user role
    const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id =r.role_id
        WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if(result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};


// Verify password
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};


// Authenticate user
const authenticateUser = async (email, password) => {
    
    const user = await findUserByEmail(email);

    if(!user) {
        return null;
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if(!isValidPassword) {
        return null;
    }

    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
};


export { createUser,
         authenticateUser
 };