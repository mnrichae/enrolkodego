const bcrypt = require('bcrypt');
const mySql = require("mysql2");
const jwt = require('jsonwebtoken');
const db = mySql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE,
});

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('index', { message: 'Error provide email and password.' });

        }
        db.query('SELECT * FROM users where email = ?', email,
            async(err, results) => {
                if (!results || password !== results[0].password) {
                    res.status(401).render('index', { message: 'Email or password is incorrect.' });
                } else {
                    db.query('SELECT * FROM students INNER JOIN courses ON courses.course_id = students.course_id ORDER BY student_id',
                        (error, results) => {
                            console.log(results)
                            if (error) {
                                console.log(error.message);
                            } else {
                                console.log('login successful')
                                res.render('list', { users: results, title: 'List of Students' });

                            }
                        });
                }
            });
    } catch (error) {
        console.log(error.message);
    }
};

exports.register = (req, res) => {

    // db.query('INSERT INTO students (first_name, last_name, email, course_id) VALUES (?, ?, ?, ?);',
    // [req.body.first_name, req.body.last_name, req.body.email, req.body.course_id],
    //     (err, results) => {
    //         db.query('SELECT * FROM students', (err, results) => {
    //             if (err) {
    //                 console.log(err.message);
    //             } else {
    //                 console.log(results);
    //                 console.log('added');
    //                 res.render('list', { users: results, title: 'List of Students' });
    //             }
    //         })
           
    //     })


    db.query('SELECT email from students WHERE email = ?', 
    [req.body.email], 
    async(err, results) => {
            if (err) {
                console.log(err.message);
            }
            if (results == 0) {
                db.query('INSERT INTO students (first_name, last_name, email, course_id) VALUES (?, ?, ?, ?);',
                [req.body.first_name, req.body.last_name, req.body.email, req.body.course_id],
                    (err, results) => {
                        db.query('SELECT * FROM students INNER JOIN courses ON courses.course_id = students.course_id ORDER BY student_id', (err, results) => {
                            if (err) {
                                console.log(err.message);
                            } else {
                                console.log(results);
                                console.log('added');
                                res.render('list', { users: results, title: 'List of Students', messageSuccess: `Successfully added ${req.body.email}` });
                            }
                        })
                    })
            } else {
                db.query('SELECT * FROM students INNER JOIN courses ON courses.course_id = students.course_id ORDER BY student_id', (err, results) => {
                    return res.render('list', { users: results, title: 'List of Students', message: `${req.body.email} already exists.` })})
            }
    });

};

exports.delete = (req, res) => {
    const email = req.params.email;
    db.query('DELETE from students where email = ?', 
    email, 
    (error, results) => {
        db.query('SELECT * FROM students INNER JOIN courses ON courses.course_id = students.course_id ORDER BY student_id',
            (error, results) => {
                console.log(results)
                if (error) {
                    console.log(error.message);
                } else {
                    res.render('list', { users: results, title: 'List of Users', message: `${req.params.email} has been deleted.` });
                }
            });

    });
};

exports.update = (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM students WHERE email = ?',
        email, 
        (error, results) => {
            // db.query('SELECT * FROM students',
            //     (error, results) => {
                console.log(results);
                if (error) {
                    console.log(error.message);
                } else {
                    console.log(results);
                    console.log('updated');
                    // res.render('list', { user: results, title: 'List of Students' });
                    updateUser(req, res);
                }
            // });
        });
};

exports.updateUser = (req, res) => {
    db.query('UPDATE students SET first_name = ?, last_name = ?, course_id = ? WHERE email = ?',
    [req.body.first_name, req.body.last_name, req.body.course_id, req.body.email],
    (err, results) => {
        db.query('SELECT * FROM students INNER JOIN courses ON courses.course_id = students.course_id ORDER BY student_id', 
        (err, results) => {
            if(err){
                console.log(err.message)
            } else {
                res.render('list', { users: results, title: 'List of students', messageSuccess: `Successfully updated ${req.body.email}` });
            }
        })
    }
    )
}