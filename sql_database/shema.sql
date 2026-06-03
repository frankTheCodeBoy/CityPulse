CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geometry GEOMETRY
);

CREATE TABLE indicators (
    id SERIAL PRIMARY KEY,
    area_id INT REFERENCES areas(id),
    population INT,
    mobility_score FLOAT,
    environment_score FLOAT,
    infrastructure_score FLOAT,
    business_activity_score FLOAT
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    area_id INT REFERENCES areas(id),
    health_score FLOAT,
    growth_index FLOAT,
    infra_index FLOAT,
    opportunity_score FLOAT
);
