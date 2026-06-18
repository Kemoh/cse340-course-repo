import bcrypt from "bcrypt";

import { createUser,
         authenticateUser,
         getAllRegisteredUsers
 } from "../models/users.js";

import { getVolunteerProjects } from "../models/projects.js";


// Create the registration form 
const showUserRegistrationForm = (req, res) => {
    res.render("register", { title: "Register"});
};

// Process the registration form 
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error registering user:", error);
        req.flash("error", "An error occured during registration. Please try again. Have you registered before? Then, login.");
        res.redirect("/register")
    }
};


// Create the login form
const showLoginForm = (req, res) => {
    res.render("login", { title: "Login"});
};


// Process the login form
const processLoginForm = async (req, res) => {
    // Gets the email and password from the request body
    const { email, password } = req.body;

    // Calls authenticateUser with the email and password
    try {
        const user = await authenticateUser(email, password);

        // Check to see if a user object is returned
        if(user) {
            // Store user info in session
            req.session.user = user;

            // Success message
            req.flash("success", "Login successful!");

            // Add a console.log() statement for debugging
            if(res.locals.NODE_ENV === "development") {
                console.log("User logged in:", user);
            }

            
            // Redirect to the dashboard page
            res.redirect("/dashboard");

        } else {
            // Error message
            req.flash("error", "Invalid email or password.");

            // Redirect back to login page
            res.redirect("/login");
        } 
    } catch (error) {
        // Log error 
        console.error("Error during login:", error);

        // Flash error message
        req.flash("error", "An error occurred during login. Please try again.");

        // Redirect back to the login page
        res.redirect("/login");
    }
};


// Process logout
const processLogout = async (req, res) => {
    // Destroys the session 
    if(req.session.user) {
        delete req.session.user;
    }

    // Success message for logout
    req.flash("success", "Logout successful!");
    
    // Redirects user to login page
    res.redirect("/login");
};


// Middleware to protect routes
const requireLogin = (req, res, next ) => {
    if(!req.session || !req.session.user) {
        req.flash("error", "You must be logged in to access that page.");
        return res.redirect("/login");
    }
    next();
};

// User dashboard
const showDashboard = async (req, res) => {
    const user = req.session.user;
    console.log("User ID:", req.session.user);


    const volunteerProjects = await getVolunteerProjects(user.user_id);

    console.log("Dashboard volunteerProjects:", volunteerProjects);
    res.render("dashboard", { title: "Dashboard",
                              user,
                              name: user.name,
                              email: user.email,
                              volunteerProjects
                            });
};


/**
 * Middleware factory to require specific role for the route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if the user is logged in first
        if(!req.session || !req.session.user) {
            req.flash("error", "You must be logged in to access this page.");
            return res.redirect("/login");
        }

        // Check if the user's role matches the required role
        if(req.session.user.role_name !== role) {
            req.flash("error", "You do not have permission to access this page.");
            return res.redirect("/dashboard");
        }

        // User has required role, continue 
        next();
    };
};



const showAllRegisteredUsers = async (req, res) => {
    const users = await getAllRegisteredUsers();
    
    const title = "Registered Users";

    res.render("users", { title, users });
};


export { showUserRegistrationForm,
         processUserRegistrationForm,
         showLoginForm,
         processLoginForm,
         processLogout,
         requireLogin,
         showDashboard,
         requireRole,
         showAllRegisteredUsers
};