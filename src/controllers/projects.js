// Import any needed model functions
import { getAllProjects,
         getUpcomingProjects,
         getProjectDetails 
} from "../models/projects.js";


// Number of projects to display on the main projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* ----------------------------------
Define any controller functions
------------------------------------- */
// Display upcoming service projects page
const showProjectsPage = async (req, res) => {
    // Retrieve upcoming service projects and pass-in the limit
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    // Title of the upcoming service projects page
    const title = "Upcoming Service Projects";

    // Render the upcoming service projects page
    res.render("projects", { title, projects });
};


// Display a single service project details page
const showProjectDetailsPage = async (req, res) => {
    // Extract the project ID from the URL
    const projectId = req.params.id;

    // Retrieve project details from the database
    const projectDetails = await getProjectDetails(projectId);
    
    // Title of the service project details page
    const title = "Service Project Details";

    // Render the project details page
    res.render("project", { title, projectDetails });
};

// Export any controller functions
export { 
    showProjectsPage,
    showProjectDetailsPage
 };