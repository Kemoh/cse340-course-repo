// Import any needed model functions
import { getAllProjects,
         getProjectsByOrganizationId,
         getUpcomingProjects,
         getProjectDetailsByProjectId,
         getCategoriesByProjectId
} from "../models/projects.js";


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

        // Retrieve project details from the database
        const projectDetails = await getProjectDetailsByProjectId(projectId);

        // Get organization name from the database
        const organization = await getProjectsByOrganizationId(projectId);

        // Update the service project details page to add the category tags for that project
        const categories = await getCategoriesByProjectId(projectId);

        // Title of the service project details page
        const title = `${projectDetails.title}`;

        // Render the project details page
        res.render("project", { title, 
                                projectDetails,
                                organization, 
                                categories 
                            });
    } catch (error) {
        next(error)
    } 
};

// Export any controller functions
export { 
    showProjectsPage,
    showProjectDetailsPage
 };