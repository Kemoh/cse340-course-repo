-- ==================================
-- Organization Table
-- ==================================
CREATE TABLE organization (
organization_id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
contact_email VARCHAR(255) NOT NULL,
logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ==================================
-- Service Project Table
-- ==================================
CREATE TABLE project (
project_id SERIAL PRIMARY KEY,
organization_id INTEGER NOT NULL,
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
location VARCHAR(150) NOT NULL,
date DATE NOT NULL,

CONSTRAINT fk_organization
    FOREIGN KEY(organization_id)
    REFERENCES organization(organization_id)
    ON DELETE CASCADE
);

 
-- =========================================
-- SERVICE PROJECTS FOR:
-- BrightFuture Builders
-- =========================================

INSERT INTO project
(organization_id, title, description, location, date)
VALUES
(
    1,
    'Community Bridge Construction',
    'Building a durable pedestrian bridge to improve transportation access for rural residents.',
    'Bo',
    '2026-06-15'
),
(
    1,
    'Affordable Housing Initiative',
    'Constructing affordable homes for low-income families using sustainable building materials.',
    'Freetown',
    '2026-07-10'
),
(
    1,
    'School Classroom Expansion',
    'Adding new classrooms and repairing damaged school facilities for growing student populations.',
    'Kenema',
    '2026-08-05'
),
(
    1,
    'Public Water Well Installation',
    'Installing community water wells to provide clean and reliable drinking water.',
    'Makeni',
    '2026-09-12'
),
(
    1,
    'Solar Lighting for Communities',
    'Installing solar-powered street lights in underserved neighborhoods to improve safety.',
    'Port Loko',
    '2026-10-01'
);




-- =========================================
-- SERVICE PROJECTS FOR:
-- GreenHarvest Growers
-- =========================================

INSERT INTO project
(organization_id, title, description, location, date)
VALUES
(
    2,
    'Urban Community Garden Project',
    'Transforming unused urban spaces into productive community vegetable gardens.',
    'Freetown',
    '2026-06-20'
),
(
    2,
    'Youth Farming Education Program',
    'Teaching students modern farming techniques and sustainable agriculture practices.',
    'Bo',
    '2026-07-18'
),
(
    2,
    'Neighborhood Composting Initiative',
    'Training households to create compost from organic waste for healthier soil production.',
    'Waterloo',
    '2026-08-11'
),
(
    2,
    'School Nutrition Garden',
    'Developing school gardens to support nutrition education and student meal programs.',
    'Makeni',
    '2026-09-06'
),
(
    2,
    'Tree and Crop Sustainability Campaign',
    'Distributing seedlings and educating residents on environmentally friendly farming methods.',
    'Kenema',
    '2026-10-14'
);




-- =========================================
-- SERVICE PROJECTS FOR:
-- UnityServe Volunteers
-- =========================================

INSERT INTO project
(organization_id, title, description, location, date)
VALUES
(
    3,
    'Community Food Distribution Drive',
    'Coordinating volunteers to distribute food packages to vulnerable families.',
    'Freetown',
    '2026-06-25'
),
(
    3,
    'Hospital Volunteer Assistance Program',
    'Providing volunteer support services for patients and healthcare workers at local hospitals.',
    'Bo',
    '2026-07-22'
),
(
    3,
    'Back-to-School Support Campaign',
    'Organizing volunteers to provide school supplies and mentoring for children.',
    'Koidu',
    '2026-08-17'
),
(
    3,
    'Neighborhood Cleanup Day',
    'Mobilizing volunteers to clean public spaces and promote environmental awareness.',
    'Makeni',
    '2026-09-09'
),
(
    3,
    'Senior Citizen Care Outreach',
    'Visiting elderly residents to provide companionship, basic assistance, and donated supplies.',
    'Port Loko',
    '2026-10-20'
);
