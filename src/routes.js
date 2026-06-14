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
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    
} from "./controllers/projects.js";


import { showCategoriesPage ,
         showCategoryDetailsPage,
         showAssignCategoriesForm,
         processAssignCategoriesForm,
         categoryValidation,
         showNewCategoryForm,
         processNewCategoryForm,
         showEditCategoryForm,
         processEditCategoryForm
} from "./controllers/categories.js";


import { showUserRegistrationForm, 
         processUserRegistrationForm,
         showLoginForm,
         processLoginForm,
         processLogout,
         requireLogin,
         showDashboard,
         requireRole
} from "./controllers/users.js"; 


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
router.get("/new-organization", 
           requireRole("admin"), 
           showNewOrganizationForm
        );

// POST Route to handle new organization form submission
router.post("/new-organization", 
            requireRole("admin"),organizationValidation, processNewOrganizationForm
        );

// GET Route to display the edit organization form
router.get("/edit-organization/:id", 
            requireRole("admin"), showEditOrganizationForm
        );

// POST Route to handle the edit organization form submission
router.post("/edit-organization/:id", 
            requireRole("admin"), organizationValidation, processEditOrganizationForm
        );

// GET route to show new project form
router.get("/new-project", 
            requireRole("admin"), 
            showNewProjectForm
        );

// POST route to handle the new project form submission
router.post("/new-project", 
            requireRole("admin"), 
            projectValidation, 
            processNewProjectForm
        );

// GET route to show the assign categories form
router.get("/assign-categories/:projectId",
            requireRole("admin"),
            showAssignCategoriesForm
        );

// POST route to handle the assign categories form submission
router.post("/assign-categories/:projectId",
            requireRole("admin"),
            processAssignCategoriesForm
        );

// GET Route to display the edit project form
router.get("/edit-project/:id",
           requireRole("admin"), 
           showEditProjectForm
        );

// POST Route to handle the edit project form submission
router.post("/edit-project/:id",
            requireRole("admin"), 
            projectValidation, 
            processEditProjectForm
        );

// GET Route to display the new category form
router.get("/new-category", 
            requireRole("admin"),
            showNewCategoryForm
        );

// POST Route to handle the new category form submission
router.post("/new-category", 
            requireRole("admin"),
            categoryValidation, 
            processNewCategoryForm
        );

// GET Route to display the edit category form
router.get("/edit-category/:id", 
            requireRole("admin"),
            showEditCategoryForm
        );

// POST Route to handle the edit category form submission
router.post("/edit-category/:id", 
            requireRole("admin"),
            categoryValidation, processEditCategoryForm
        );

// GET Route to display the user registration form
router.get("/register", showUserRegistrationForm);

// POST Route to handle the user registration form submission
router.post("/register", processUserRegistrationForm);

// GET Route to display the login form
router.get("/login", showLoginForm);

// POST Route to handle the login form submission
router.post("/login", processLoginForm);

// GET Route to display the logout form
router.get("/logout", processLogout);

// GET Route to display user dashboard
router.get("/dashboard", requireLogin, showDashboard);


// Export the router object for use in server.js
export default router;