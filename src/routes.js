// Import express package
import express from "express";

// Import all controller functions
import { showHomePage } from "./controllers/index.js";

import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm 
} from "./controllers/organizations.js";

import { 
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm
} from "./controllers/projects.js";

import { showCategoriesPage ,
         showCategoryDetailsPage,
         showAssignCategoriesForm,
         processAssigncategoriesForm
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

// GET route to show New organization form
router.get("/new-organization", showNewOrganizationForm);

// POST Route to handle new organization form submission
router.post("/new-organization", organizationValidation, processNewOrganizationForm);

// GET Route to display the edit organization form
router.get("/edit-organization/:id", showEditOrganizationForm);

// POST Route to handle the edit organization form submission
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);

// GET route to show new project form
router.get("/new-project", showNewProjectForm);

// POST route to handle the new project form submission
router.post("/new-project", processNewProjectForm);

// GET route to show the assign categories form
router.get("/assign-categories/:projectId", showAssignCategoriesForm);

// POST route to handle the assign categories form submission
router.post("/assign-categories/:projectId", processAssigncategoriesForm);

// Export the router object for use in server.js
export default router;