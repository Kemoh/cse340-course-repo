// Import any needed model functions
import { getAllOrganizations } from "../models/organizations.js";

import { getAllProjects,
         getProjectsByOrganizationId,
         getUpcomingProjects,
         getProjectDetailsByProjectId,
         getCategoriesByProjectId,
         createProject,
         updateProject,
         addVolunteerToProject,
         removeVolunteerFromProject,
         getVolunteerStatus,
         getVolunteerProjectsByUser
} from "../models/projects.js";

// Import the validation functions from express validator
import { body, validationResult } from "express-validator";


/** --------------------------------------------------------------
 *  Define validation and sanitization rules for project form
 * ------------------------------------------------------------*/

// Define validation rules for project form
const projectValidation = [
    // title field
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage("Project title must be between 3 and 150 characters."),

    // description field
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required.")
        .isLength({ max: 500 })
        .withMessage("Project description cannot exceed 500 characters."),

    // location field
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Project location is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage("Project location must be between 2 and 150 characters."),

    // date field
    body("date")
        .notEmpty()
        .withMessage("Project date is required.")
        .withMessage("Please provide a valid date."),

    // organization field
    body("organizationId")
        .notEmpty()
        .withMessage("Please select an organization.")
        .isInt({ min: 1 })
        .withMessage("A valid organization must be selected.")
];


// Number of projects to display on the main projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* ----------------------------------
Define any controller functions
------------------------------------- */
// Display upcoming service projects page
const showProjectsPage = async (req, res, next) => {
    try {
        // Call the  model function to extract data
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        // Title of the upcoming service projects page
        const title = "Upcoming Service Projects";

        // Render the upcoming service projects page
        res.render("projects", { title, projects });
    } catch (error) {
        next(error)
    }
};


// Display a single service project details page
const showProjectDetailsPage = async (req, res, next) => {
    try {
        // Extract the project ID from the URL
        const projectId = req.params.id;

        const userId = req.session.user.user_id || null;

        // Retrieve project details from the database
        const projectDetails = await getProjectDetailsByProjectId(projectId);

        // Get organization name from the database
        const organization = await getProjectsByOrganizationId(projectId);

        // Update the service project details page to add the category tags for that project
        const categories = await getCategoriesByProjectId(projectId);


        // Check whether the logged-in user is already volunteering
        const isVolunteer = userId
      ? await getVolunteerStatus(userId, projectId)
      : false;

        // Title of the service project details page
        const title = `${projectDetails.title}`;

        // Render the project details page
        res.render("project", { title, 
                                projectDetails,
                                organization, 
                                categories,
                                isVolunteer
                            });
    } catch (error) {
        next(error)
    } 
};


// Insert new service project
const showNewProjectForm = async (req, res) => {
    // Get a list of all the organizations from the database
    const organizations = await getAllOrganizations();

    // Create the title for the view
    const title = "Add New Service Projects";

    console.log("Redirecting to:", `/project/${projectId}`);

    // Render the new project view
    res.render("new-project", { title, organizations });
};


// Process the new project form
const processNewProjectForm = async (req, res, next) => {
    // Extract form data from req.body
    const { 
        organizationId,
        title, 
        description, 
        location, 
        date
        } = req.body;

        try {
            // Create the new project in the database
            const newProjectId = await createProject(
                title,
                description,
                location,
                date,
                organizationId
            );

            req.flash("success", "New service project created successfully!");

            res.redirect(`/project/${newProjectId}`);
            
        } catch (error) {
            console.log("Error creating new project:", error);

            req.flash("error", "There was an error creating the service project.");

            res.redirect("/new-project");
        }
};


const showEditProjectForm = async (req, res) => {
    // Get the project ID from req.params.id
    const projectId = req.params.id;

    // Call the model function and pass in the projectId to get the project details by it's ID
    const projectDetails = await getProjectDetailsByProjectId(projectId);

    // Call the model function to get all organizations
    const organizations = await getAllOrganizations();

    // Give the form a title
    const title = "Edit Service Project";

    // render the form with the required data
    res.render("edit-project", { title, 
                                 projectDetails, 
                                 organizations 
                                });
};



const processEditProjectForm = async (req, res) => {
    // Get the project ID from req.params.id
    const projectId = req.params.id;

    // Get the data from req.body
    const { title, description, location, date, organizationId } = req.body;

     // Check for validation errors
    const results = validationResult(req);
     if(!results.isEmpty()) {
        // validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

    // Redirect back to the edit project form
        return res.redirect("/edit-project/" + projectId);
    }

    // Call the model function to update the project
    await updateProject(
        projectId,
        title,
        description,
        location,
        date,
        organizationId
    );

     // Set a success flash message
    req.flash("success", "Project updated successfully!");

    // Redirect to the project details page using its ID
    res.redirect(`/project/${projectId}`);
};



// User volunteers for a project
const userVolunteerForProject = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be signed in to volunteer.");
      return res.redirect("/login");
    }

    const userId = req.session.user.user_id;

    const projectId = req.params.id;

    const isVolunteer = await getVolunteerStatus(userId, projectId);

        if(!isVolunteer) {
            await addVolunteerToProject(userId, projectId);

            req.flash("success", "You are now volunteering for this project.");
        } else {
            req.flash("error", "You are already volunteering for this project.");
        }
      
    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(`User ${userId} volunteered for project ${projectId}
          `);
      }

    res.redirect(`/project/${projectId}`);
  } 
  catch (error) {
    next(error);
  }
};



// User removes volunteering from a project
const removeVolunteerForProject = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be signed in to change volunteer status.");
      return res.redirect("/login");
    }

    const userId = req.session.user.user_id;

    const projectId = req.params.id;

    const isVolunteer = await getVolunteerStatus(userId, projectId);

    if(isVolunteer) {
      await removeVolunteerFromProject(userId, projectId);

      req.flash("success", "You have removed yourself from this project.");
    } else {
      req.flash("error", "You are not volunteering for this project.");
    }


    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(`User ${userId} removed volunteer for project ${projectId}`);
      }

    res.redirect(`/project/${projectId}`);
   
  } catch (error) {
    next(error);
  }
};


const showVolunteeringPage = async (req, res, next) => {
  try {
    const userId = req.session.user.user_id;

    const volunteeredProjects = await getVolunteerProjectsByUser(userId);

    const title = "My Volunteering Projects";

    res.render("volunteering", {title,
                                volunteeredProjects
                              });
  } catch (error) {
    next(error);
  }
};



// Export any controller functions
export { 
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    userVolunteerForProject,
    removeVolunteerForProject,
    showVolunteeringPage
 };