// Import file
import { fileURLToPath } from "url";

// Import path
import path from "path";

// Import the express package
import express from "express";

// Import test connection to database
import { testConnection } from "./src/models/db.js";

// Import getAllOrganizations function
import { getAllOrganizations } from "./src/models/organizations.js";

// Import getAllProjects function
import { getAllProjects } from "./src/models/projects.js";

// Create the express app
const app = express();

// Defines the application environment
const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || "production";

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Create filename
const __filename = fileURLToPath(import.meta.url);

// Create directory
const __dirname = path.dirname(__filename);

/* -------------------------------
* Configure Express middleware
---------------------------------- */
// Server static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));


/* -------------------------------
* Route Handler
---------------------------------- */
// Home
app.get("/", async(req, res) => {
    const title = "Home"
    res.render("home", { title });
});

// Organizations
app.get("/organizations", async(req, res) => {
    const organizations = await getAllOrganizations();
    const title = "Our Partner Organizations";
    res.render("organizations", { title, organizations });
});

// Projects
app.get("/projects", async(req, res) => {
    const projects = await getAllProjects();
    const title = "Service Projects"
    res.render("projects", { title, projects });
});

// Categories
app.get("/categories", async(req, res) => {
    const title = "Service Categories"
    res.render("categories", { title });
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