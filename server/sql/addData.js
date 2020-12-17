
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
            console.log(`${dept} ${number} ${title}`);
            let result = await addCourse(client, dept, number, title);
            console.table(result);

            // add instructor

            // add class
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
    console.log(dept);
    console.log(number);
    return client.query(`INSERT INTO courses(title,dept,number) VALUES ('${title}','${dept}','${number}') ON CONFLICT DO NOTHING`);
}

function getInstructorId(client, name) {
    // client = await pool.connect();
    return client.query(`SELECT id from instructors WHERE '${name}' = name`);
}

function getCourseID(client, title) {
    // let client = await pool.connect();
    return client.query(`SELECT id FROM courses WHERE '${title}' = title`);
}

