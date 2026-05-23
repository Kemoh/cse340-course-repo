// Import express package
import express from "express";

// Import all controller functions
import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showProjectsPage } from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

// Create the express router objext
const router = express.Router();

// Use the router object to define the pages routes
router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);

// Use the router object to define the error-handling routes
router.get("/test-error", testErrorPage);

// Export the router object for use in server.js
export default router;