import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT * FROM public.organization
        ORDER BY organization_id ASC`;

    const result = await db.query(query);

    return result.rows;
}

export {getAllOrganizations} 