// Import express package
import express from "express";

// Import all controller functions
import { showHomePage } from "./controllers/index.js";

import { 
    showOrganizationsPage, showOrganizationDetailsPage 
} from "./controllers/organizations.js";

import { 
    showProjectsPage,
    showProjectDetailsPage
} from "./controllers/projects.js";

import { showCategoriesPage ,
         showCategoryDetailsPage
} from "./controllers/categories.js";

import { testErrorPage } from "./controllers/errors.js";


// Create the express router objext
const router = express.Router();

/* -----------------------------------------------
Use the router object to define the pages routes
-------------------------------------------------- */
// Home page
router.get("/", showHomePage);

// Organizations page
router.get("/organizations", showOrganizationsPage);

// Organization page
router.get("/organization/:id",showOrganizationDetailsPage);

// Projects page
router.get("/projects", showProjectsPage);

// Single project details page
router.get("/project/:id", showProjectDetailsPage);

// Categories page
router.get("/categories", showCategoriesPage);

// Single category details page
router.get("/category/:id", showCategoryDetailsPage);

// Test error page
router.get("/test-error", testErrorPage);

// Export the router object for use in server.js
export default router;