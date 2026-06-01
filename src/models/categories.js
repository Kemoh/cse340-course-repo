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


export { getAllCategories,
         getCategoryByCategoryId,
         getProjectsByCategoryId
        };