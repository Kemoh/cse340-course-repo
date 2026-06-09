// Import any needed model functions
import { getAllCategories,
         getCategoryByCategoryId,
         getProjectsByCategoryId,
         updateCategoryAssignments
 } from "../models/categories.js";

 import { getProjectDetailsByProjectId,
          getCategoriesByProjectId
  } from "../models/projects.js";


// Define any controller functions
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = "Service Categories";
        res.render("categories", { title, categories });
        
    } catch (error) {
        next(error)
    } 
};


// Display a single category details page
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        // Extract the category ID from the URL
    const categoryId = req.params.id;

    // Get a single category details from the database 
    const categoryDetails = await getCategoryByCategoryId(categoryId);

    // Get all project details from the database
    const projectDetails = await getProjectsByCategoryId(categoryId);
    
    // Title of the category details page
    const title = categoryDetails.name;

    // Render the category details page
    res.render("category", { title, categoryDetails,projectDetails });

    } catch (error) {
        next(error)
    }
};


const showAssignCategoriesForm = async (req, res) => {
    // Get the project ID from request parameters
    const projectId = req.params.projectId;

    // Retrieve the project details
    const projectDetails = await getProjectDetailsByProjectId(projectId);

    // Retrieve all project categories
    const categories = await getAllCategories();

    // Retrieve all categories assigned to a project
    const assignedCategories = await getCategoriesByProjectId(projectId);

    // Create the title
    const title = "Assign Categories to Project";

    // Render the assign categories view
    res.render("assign-categories", { title,
                                      projectId,
                                      projectDetails,
                                      categories,
                                      assignedCategories
                                    });
};


const processAssignCategoriesForm = async (req, res) => {
    // Get the project ID from request parameters
    const projectId = req.params.projectId;
    
    // get the selected category IDs from the request body
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    // Call the updateCategoryAssignments function from the model
    await updateCategoryAssignments(projectId, categoryIdsArray);

    // Write a success message
    req.flash("success", "Categories updated successfully.");

    // Redirects the user back to the project details page
    res.redirect(`/project/${projectId}`);
    
}


// Export any controller functions
export { showCategoriesPage,
         showCategoryDetailsPage,
         showAssignCategoriesForm,
         processAssignCategoriesForm
        };