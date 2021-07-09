const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeeded.');


        //Get all employees
        app.get('/employees', (req, res) => {
            mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else {
                    console.log(err);
                    res.send(err);
                }
                    
            })
        });

        //Get an employees
        app.get('/employees/:id', (req, res) => {
            mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0)
                        res.send(rows[0]);
                    else {
                        res.status(400).send(
                            {
                                "statusCode": 404,
                                "error": "Not Found",
                                "message": "Employee not found"
                            }
                        )
                    }

                }

                else {
                    console.log(err);
                    res.send(err);
                }
                
            })
        });

        //Delete an employee
        app.delete('/employees/:id', (req, res) => {
            mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0)
                        res.send("Deleted successfully");
                    else {
                        res.status(400).send(
                            {
                                "statusCode": 404,
                                "error": "Not Found",
                                "message": "Employee not found"
                            }
                        )
                    }

                }
                else {
                    console.log(err);
                    res.send(err);
                }
            })
        });

        //Insert an Employee
        app.post('/employees', (req, res) => {
            let emp = req.body;
            var sql = "INSERT INTO Employee (Name, EmpCode, Salary) \
   VALUES (?,?,?);";
            mysqlConnection.query(sql, [emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
                if (!err)
                    res.send('Inserted Successfully!');
                else {
                    console.log(err);
                    res.send(err);
                }
            })
        });

        //Insert an employees
        // app.post('/employees', (req, res) => {
        //     let emp = req.body;
        //     var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
        //     CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
        //     mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        //         if (!err)
        //             rows.forEach(element => {
        //                 if(element.constructor == Array)
        //                 res.send('Inserted employee id : '+element[0].EmpID);
        //             });
        //         else
        //             console.log(err);
        //     })
        // });

        //Update an employees
        app.put('/employees', (req, res) => {
            let emp = req.body;
            var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
            CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
            mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
                if (!err)
                    res.send('Updated successfully');
                else {
                    console.log(err);
                    res.send(err);
                }
            })
        });

        app.listen(3000, () => console.log('Express server is running at port no : 3000'));

    }
    
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));

});

