import db from "./db.js";

// Get all service projects with their organization names
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

// Get the next upcoming service projects 
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

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};


// Get one service project by ID
const getProjectDetails = async (id) => {
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

    const result = await db.query(query, [id]);
    console.log(result);
    return result.rows[0];
    
}

// Export the model functions
export { 
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails
 };