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



// Get all volunteered projects
const getVolunteerProjects = async (userId) => {
  const query = `
    SELECT
      pv.volunteer_id,
      pv.user_id,
      pv.project_id,
      pv.volunteered_at,
      p.title,
      p.description,
      p.location,
      p.date,
      o.organization_id,
      o.name AS organization_name
    FROM project_volunteers pv
    JOIN project p ON pv.project_id = p.project_id
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
      AND pv.active = TRUE
    ORDER BY pv.volunteered_at DESC;
  `;


  const queryParams = [userId];

  const result = await db.query(query, queryParams);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(`Retrieved ${result.rowCount} volunteer projects for user ID: ${userId}`);
  }

  return result.rows;
};



// Add volunteer to a project
const addVolunteerToProject = async (userId, projectId) => {
  const insertQuery = `
    INSERT INTO project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING volunteer_id;
  `;

  const insertParams = [userId, projectId];

  const insertResult = await db.query(insertQuery, insertParams);

  let volunteerId;
  
  if (insertResult.rowCount > 0) {
    volunteerId = insertResult.rows[0].volunteer_id;
  } 
  else {
    const selectQuery = `
      SELECT volunteer_id FROM project_volunteers
      WHERE user_id = $1 AND project_id = $2;
    `;

     const selectParams = [userId, projectId];

    const selectResult = await db.query(selectQuery, selectParams);

    if (selectResult.rowCount === 0) {
      throw new Error("Failed to add or find volunteer record.");
    }
    volunteerId = selectResult.rows[0].volunteer_id;
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Added or found volunteer record ID:", volunteerId, "for project ID:", projectId);
  }

  return volunteerId;
};



// Remove a volunteer from a project
const removeVolunteerFromProject = async (userId, projectId) => {
  const query = `
    UPDATE project_volunteers
    SET active = FALSE
    WHERE user_id = $1
      AND project_id = $2
      AND active = TRUE
    RETURNING volunteer_id, project_id;
  `;

  const queryParams = [userId, projectId];

  const result = await db.query(query, queryParams);

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Soft-removed volunteer record ID:", row.volunteer_id, "for project ID:", row.project_id);
  }

  return row;
};



// Checking if a user is already volunteering for a project
const getVolunteerStatus = async (userId, projectId) => {
  const query = `
    SELECT 1
    FROM project_volunteers
    WHERE project_id = $1
      AND user_id = $2
      AND active = TRUE;
  `;

  const queryParams = [projectId, userId];

  const result = await db.query(query, queryParams);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Checked volunteer status for project ID:", projectId, "user ID:", userId);
  }

  return result.rowCount > 0;
};



// Add volunteer to a project
// const addVolunteerToProject = async (userId, projectId) => {
//     const query = `
//             INSERT INTO project_volunteers(user_id, project_id)
//             VALUES ($1, $2)
//             ON CONFLICT(user_id, project_id)
//             DO NOTHING
//             RETURNING volunteer_id;
//     `;

//     const queryParams = [userId, projectId];

//     const result = await db.query(query, queryParams);

//     let volunteerId;
//     if(result.rowCount > 0) {
//         volunteerId = result.rows[0].volunteer_id;
//     } else {
//         const query = await `
//             SELECT volunteer_id 
//             FROM project_volunteers
//             WHERE user_id = $1
//             AND project_id = $2;
//         `;
//     }

//     if(result.rows === 0) {
//         throw new Error("Failed to add volunteer to project.");
//     }

//     if(process.env.ENABLE_SQL_LOGGING === "true") {
//         console.log("Added volunteer to project ID:", projectId);
//     }
// };


// Remove a volunteer from a project
// const removeVolunteerFromProject = async (userId, projectId) => {
//     const query = `
//         DELETE FROM project_volunteers 
//         WHERE user_id = $1
//         AND project_id = $2;
//     `;

//     const queryParams = [userId, projectId];

//     const result = await db.query(query, queryParams);

//     if(result.rows === 0) {
//         throw new Error("Failed to remove volunteer from project.");
//     }

//     if(process.env.ENABLE_SQL_LOGGING === "true") {
//         console.log("Removed volunteer from project ID:", projectId);
//     }
// };


// // Checking if a user is already volunteering for a project
// const getVolunteerStatus = async (userId, projectId) => { const query = `
//         SELECT 1
//         FROM project_volunteers
//         WHERE project_id = $1
//         AND user_id = $2;
//     `;

//     const queryParams = [userId, projectId];

//     const result = await db.query(query, queryParams);

//     if(process.env.ENABLE_SQL_LOGGING === "true") {
//         console.log("Checked volunteer status for project ID:", projectId);
//     }

//     return result.rowCount > 0; 
// };


// Get all projects a user has volunteered for
// const getVolunteeredProjects = async (userId) => {
//     const query = `
//         SELECT p.project_id,
//                p.title,
//                p.description,
//                p.location,
//                p.date
//         FROM project_volunteers pv
//         JOIN  project p
//             ON pv.project_id = p.project_id
//         WHERE pv.user_id = $1;
//     `;

//     const queryParams = [userId];

//     const result = await db.query(query, queryParams);

//     if(process.env.ENABLE_SQL_LOGGING === "true") {
//         console.log(`Retrieved ${result.rowCount} volunteer projects for user ID: ${userId}`);
//     }
    
//     return result.rows;
// }



// Export the model functions
export { 
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetailsByProjectId,
    getCategoriesByProjectId,
    createProject,
    updateProject,
    addVolunteerToProject,
    removeVolunteerFromProject,
    getVolunteerStatus,
    getVolunteerProjects 
};