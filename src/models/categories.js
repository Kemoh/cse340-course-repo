import { query } from 'express-validator';
import db from './db.js';

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT
            category_id, name
            FROM category
            ORDER BY name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};


// Retrieve a category by its ID
const getCategoryByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            category_id, name
        FROM category
        WHERE category_id = $1
        LIMIT 1
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result. rows[0];
};



// Retrieve all categories for a given service project.
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date
        FROM project p
        JOIN project_category pc
                ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.title ASC
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};


// Assign a category to a project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category(category_id, project_id)
         VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};


// Update category assigned to a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for(const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}


// Inserting new categories
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
            VALUES($1)
            RETURNING category_id, name;
    `;

    const queryParams = [name];

    const result = await db.query(query, queryParams);

    if(result.rows.length === 0) {
        throw new Error("Failed to create category.");
    }

    if(process.env.ENABLE_SQL_LOGGING === "true") {
        console.log("Created new category with ID:", result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};



const updateCategory = async (categoryId, name) => {
  const query = `UPDATE category
         SET 
         name = $1
         WHERE category_id = $2
         RETURNING name, category_id`;

  const queryParams = [name, categoryId];

  const result = await db.query(query, queryParams);

  if(result.rows.length === 0) {
    throw new Error("Category not found.");
  }

  if(process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated category with ID:", categoryId);
  }

  return result.rows[0].category_id;
  
};


export { getAllCategories,
         getCategoryByCategoryId,
         getProjectsByCategoryId,
         updateCategoryAssignments,
         createCategory,
         updateCategory
        };