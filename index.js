// require in inquirer library and connection to database
const inquirer = require("inquirer");
const db = require('./db/connection');

// connect to the database to the server
db.connect(err => {
    if (err) throw err;
    console.log('connected to database');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
       
        type: 'list',
        name: 'prompt',
        message: 'Select from the options below:',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        // Views the Department Table in the Database
        if (answers.prompt === 'View All Department') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("View Departments Below: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Here are a list of roles for the employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Here are all the available employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                // Add a department to the database
                type: 'input',
                name: 'department',
                message: 'What is the dpeartment?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} .`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add A Role') {
            // write query tp select role from the department table
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // command for user to input the role of the employee
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the employee role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please include a role!');
                                return false;
                            }
                        }
                    },
                    {
                        // command for the user input for salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please include a salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // command for the user input for selecting the department of the employee
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // store the input values in a variable for retireving later
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add An Employee') {
            // send query from database to recall the employee role and their corresponding manager
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // prompt user input for employee first name
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please include a first name.');
                                return false;
                            }
                        }
                    },
                    {
                        // prompt user input for employee last name
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please include a last name.');
                                return false;
                            }
                        }
                    },
                    {
                        // prompt user input for employee's role
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        // prompt user input for employees respective manager
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please Add A Manager!');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    // store inputted values from answers into a variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_name) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.managerName], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // prompt command for user to update employee 
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // prompt command for user to update employee role 
                        type: 'list',
                        name: 'role',
                        message: 'What is the selected employees new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Thank you for your input!");
        }
    })
};