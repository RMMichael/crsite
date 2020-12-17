
const { courses, classes } = require("./data");

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
    // ssl : process.env.DEBUG ? false : true
})

async function addData() {
    let client = await pool.connect();
    try {
        for (let {code, instructor, dept, number, label} of classes) {
            // add course
            let title = getTitle(courses, dept, number);
            if (!title) {
                console.log(`title not found for: ${dept} ${number}; using label: ${label}`);
                title = label;
            }
            let result = await addCourse(client, dept, number, title);
            // console.table(result);

            // add instructor
            result = await addInstructor(client, instructor);
            // add class
            result = await getInstructorId(client, instructor);
            let profId = result.rows[0].id;
            result = await getCourseID(client, title);
            let courseId = result.rows[0].id;
            console.log(profId);
            console.log(courseId);
            let term = 'Winter 2021';
            result = await addClass(client, code, courseId, profId, term);

        }
    } finally {
        client.release();
    }
}

addData();

function getTitle(courses, dept, number) {
    for (let { dept: c_dept, number: c_number, title: c_title } of courses) {
        if (
            dept.trim().toUpperCase() === c_dept.trim().toUpperCase() &&
            number.trim().toUpperCase() === c_number.trim().toUpperCase()
        ) {
            return c_title;
        }
    }
    return null;
}

async function addCourse(client, dept, number, title) {
    return client.query(`INSERT INTO courses(title,dept,number) VALUES ('${title}','${dept}','${number}') ON CONFLICT DO NOTHING`);
}

async function addClass(client, code, courseId, profId, term) {
    return client.query(`INSERT INTO classes(course_code,course_id,instructor_id,term) VALUES (${code},${courseId},${profId},'${term}') ON CONFLICT DO NOTHING`);
}

async function addInstructor(client, name) {
    return client.query(`INSERT INTO instructors(name) VALUES ('${name}') ON CONFLICT DO NOTHING`);
}

async function getInstructorId(client, name) {
    // client = await pool.connect();
    return client.query(`SELECT id from instructors WHERE '${name}' = name`);
}

async function getCourseID(client, title) {
    // let client = await pool.connect();
    return client.query(`SELECT id FROM courses WHERE '${title}' = title`);
}

