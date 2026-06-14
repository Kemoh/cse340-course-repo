// Import the express package
import express from "express";

// Import the express session
import session from "express-session"; 

// Import flash middleware
import flash from "./src/middleware/flash.js";

// Load SESSION_SECRET from the .env file
const SESSION_SECRET = process.env.SESSION_SECRET;

// Import file
import { fileURLToPath } from "url";

// Import path
import path from "path";

// Import test connection to database
import { testConnection } from "./src/models/db.js";

// Import router
import router from "./src/routes.js";

// Defines the application environment
const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || "production";

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Create filename
const __filename = fileURLToPath(import.meta.url);

// Create directory
const __dirname = path.dirname(__filename);

// Create the express app
const app = express();


/* -------------------------------
* Configure Express middleware
---------------------------------- */
// Set up session management
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 60 * 60 * 1000 }}));

// Use flash message middleware
app.use(flash);


// Allow Express to receive and process common POST data
app.use(express.urlencoded({extended : true}));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));


// Middleware to log all incoming requests
app.use((req, res, next) => {
    if(NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});


// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    // Indicate the login status of the user
    res.locals.isLoggedIn = false;

    if(req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.user = req.session.user || null;

    res.locals.NODE_ENV = NODE_ENV;
    next();
});


// Use the imported router to handle routes 
app.use(router);


// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error("Page Not Found.");
    err.status = 404;
    next(err);
});


// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error("Error occurred:", err.message);
    console.error("Stack trace:", err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? "404" : "500";

    // Prepare data for the template
    const context = {
        title: status === 404 ? "Page Not Found" : "Server Error",
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});


// Log app operation
app.listen(PORT, async () => {
    // Test database connection
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`)
        console.log(`Environment: ${NODE_ENV}`)
    } catch (error) {
        console.error("Error connecting to the database:", error);
    } 
});