import db from "./db.js";

// Get all projects with their organization names
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};


// Get all projects by its organization ID
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date; 
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

// Get upcoming service projects 
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};


// Get a project details by its ID
const getProjectDetailsByProjectId = async (projectId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
        LIMIT 1
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};


// Get all categories for a given project by its ID
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT 
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
}


// Inserting new service projects
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (
            title,
            description,
            location,
            date,
            organization_id
        )
            VALUES($1, $2, $3, $4, $5)
            RETURNING project_id;
    `;

    const queryParams = [
            title,
            description,
            location,
            date,
            organizationId
    ];

    const result = await db.query(query, queryParams);

    if(result.rows.length === 0) {
        throw new Error("Failed to create project.");
    }

    if(process.env.ENABLE_SQL_LOGGING === "true") {
        console.log("Created new project with ID:", result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}



const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `UPDATE project
         SET 
            title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
         WHERE project_id = $6
         RETURNING title,
                   description,
                   location,
                   date,
                   organization_id,
                   project_id; `;

  const queryParams = [title, 
                       description, 
                       location, 
                       date,
                       organizationId,
                       projectId
                      ];

  const result = await db.query(query, queryParams);

  if(result.rows.length === 0) {
    throw new Error("No service project was updated.");
  }

  if(process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated service project with ID:", projectId);
  }

  return result.rows[0].project_id;
  
};

// Export the model functions
export { 
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetailsByProjectId,
    getCategoriesByProjectId,
    createProject,
    updateProject
 };