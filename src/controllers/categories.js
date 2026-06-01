// Import any needed model functions
import { getAllCategories,
         getCategoryByCategoryId,
         getProjectsByCategoryId
 } from "../models/categories.js";


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


// Export any controller functions
export { showCategoriesPage,
         showCategoryDetailsPage
        };