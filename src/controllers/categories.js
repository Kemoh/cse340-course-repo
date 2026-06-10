// Import any needed model functions
import { getAllCategories,
         getCategoryByCategoryId,
         getProjectsByCategoryId,
         updateCategoryAssignments,
         createCategory,
         updateCategory
 } from "../models/categories.js";

 import { getProjectDetailsByProjectId,
          getCategoriesByProjectId
  } from "../models/projects.js";


  // Import the validation functions from express validator
import { body, validationResult } from "express-validator";



/** --------------------------------------------------------------
 *  Define validation and sanitization rules for category form (Server-side validation)
 * ------------------------------------------------------------*/

// Define validation rules for category form
const categoryValidation = [
    // name feild
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters.")
];



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


const showNewCategoryForm = async (reqc, res) => {
    const title = "Add New Category";

    res.render("new-category", { title });
};



const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()) {
            // Validation failed - loop through errors
            results.array().forEach((error) => {
                req.flash("error", error.msg);
            });

            // Redirect back to the new category form
            return res.redirect("/new-category");
        }

    // Pass the input field name to the request body
    const { name } = req.body; 

    // Get the input field name from the database
    const categoryId = await createCategory(name);

    // Set a success flash message
    req.flash("success", "Category added successfully!");

    // Redirect to a specific category page
    res.redirect(`/category/${categoryId}`);
};



const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryByCategoryId(categoryId);

    const title = "Edit Category";

    res.render("edit-category", { title, category });
};


const processEditCategoryForm = async (req, res) => {
    // Get the category ID from req.params.id
    const categoryId = req.params.id;

    // Get the data from req.body
    const { name } = req.body;

    // Check for validation errors
    const results = validationResult(req);
     if(!results.isEmpty()) {
        // validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect("/edit-category/" + categoryId);
     }

    // Call the model function to update the category 
    await updateCategory(categoryId, name);

    // Set a success flash message
    req.flash("success", "Category updated successfully!");

    // Redirect to the category page using it's ID
    res.redirect(`/category/${categoryId}`);
};



// Export any controller functions
export { showCategoriesPage,
         showCategoryDetailsPage,
         showAssignCategoriesForm,
         processAssignCategoriesForm,
         categoryValidation,
         showNewCategoryForm,
         processNewCategoryForm,
         showEditCategoryForm,
         processEditCategoryForm
        };