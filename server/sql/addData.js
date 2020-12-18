
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
    const client = await pool.connect();
    try {
        let maxUsers = 10;
        for (let i = 1; i <= maxUsers; i++) {
            await addUser(client, `email${i}@uci.edu`, i * 100);
        }


        let reviews = 0;
        let maxReviews = 200;
        let maxReviewsPerClass = 5;
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
            // result = await addInstructor(client, instructor);
            // add class
            // result = await getInstructorId(client, instructor);
            // let profId = result.rows[0].id;
            // result = await getCourseID(client, title);
            console.log(`getting course id: ${dept} ${number}`);
            result = await getCourseId2(client, dept, number);
            let courseId = result.rows[0].id;
            // console.log(profId);
            // console.log(courseId);
            let term = 'Winter 2021';
            // result = await addClass(client, code, courseId, profId, term);
            console.log(`adding class: ${code} ${courseId} ${instructor} ${term}`);
            result = await addClass2(client, code, courseId, instructor, term);
            console.table(result.rows[0]);
            if (reviews < maxReviews) {
                let randReviewCount = randInt(1, Math.min(maxReviews - reviews + 1, maxReviewsPerClass));
                for (let i = 0; i < randReviewCount; i++) {
                    let randId = randInt(1, maxUsers + 1);  // assume user ids 1..maxUsers
                    console.log(`adding random review: ${randId} ${code}`);
                    result = await addRandomReview(client, randId, code);
                    reviews++;
                }
            }
        }
    } finally {
        console.log(`releasing client...`);
        client.release();
        console.log(`done`);
    }
}

addData();

function randInt(min, max) {
    //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

async function addRandomReview(client, userId, code) {
    return client.query(
        `INSERT INTO reviews(user_id, course_code, review_text, difficulty, hours_per_week, rating) values ($1, $2, $3, $4, $5, $6)`,
        [userId, code, "Loved this class!", randInt(1, 5), randInt(5, 20), randInt(1, 5)]
    );
}

async function addUser(client, email, googleId) {
    return client.query(
        `INSERT INTO users(email, google_id) values ($1, $2)`,
        [email, googleId]
    );
}

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
    return client.query(
        `INSERT INTO courses(title,dept,number) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [title, dept, number]
    );
}

async function addClass(client, code, courseId, profId, term) {
    return client.query(
        `INSERT INTO classes(course_code,course_id,instructor_id,term) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [code, courseId, profId, term]
    );
}

async function addClass2(client, code, courseId, profName, term) {
    return client.query(
        `INSERT INTO classes(course_code,course_id,instructor,term) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [code, courseId, profName, term]
    );
}

async function addInstructor(client, name) {
    return client.query(`INSERT INTO instructors(name) VALUES ($1) ON CONFLICT DO NOTHING`, [name]);
}

async function getInstructorId(client, name) {
    return client.query(`SELECT id from instructors WHERE name = $1`, [name]);
}

async function getCourseID(client, title) {
    return client.query(`SELECT id FROM courses WHERE title = $1`, [title]);
}

async function getCourseId2(client, dept, number) {
    return client.query(`SELECT id FROM courses WHERE dept = $1 AND number = $2`, [dept, number]);
}
