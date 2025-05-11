const express = require('express')
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { check, checkExact, validationResult, query } = require('express-validator');

const router = express.Router()
router.use(express.static(path.join(__dirname, '../client/build')));

const db = new sqlite3.Database('VACCINATION_DB.db');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  try {
    console.log("getting student data");
    db.all("select s.*,sdtls.dtl_id,sdtls.year, sdtls.grade, sdtls.section, sdtls.roll_no from STUDENT s left join STUDENT_DETAILS sdtls on s.STUDENT_ID = sdtls.STUDENT_ID",
      (error, rows) => {
        if (!error) {
          res.status(200)
          res.send(rows);
        }
        else {
          res.status(500);
          res.send(error);
        }
      });
  }
  catch (error) {
    res.send(error)
  }
});

router.get('/:id', [check('id').isInt().notEmpty().withMessage('Empty roll number')], (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty) {
      console.log("get student with : ", req.params.id);
      db.get(`select s.*,sdtls.dtl_id,sdtls.year, sdtls.grade, sdtls.section, sdtls.roll_no from STUDENT s left join STUDENT_DETAILS sdtls on s.STUDENT_ID = sdtls.STUDENT_ID where sdtls.year = (select max(year) from STUDENT_DETAILS) and s.student_id = '${req.params.id}'`, (error, row) => {
        if (!error) {
          res.status(200);
          res.send(row);
        }
        else {
          res.status(500);
          res.send(error);
        }
      });
    } else {
      res.status(400);
      res.send("Field validations failed. Invalid fields");
    }
  }
  catch (error) {
    res.status(500);
    res.send(error)
  }
});

router.post('/', jsonParser,
  [
    check('STUDENT_NAME').isAlpha().notEmpty().withMessage("Student Name is required field"),
    check('DOB').isDate().notEmpty().withMessage("DOB is required field"),
    check('ADDRESS').isAlphanumeric().notEmpty().withMessage("Address is required field"),
    check('PHONE').isInt().notEmpty().withMessage("Phone is required field"),
    check('FATHER_NAME').isAlpha().notEmpty().withMessage("Father Name is required field"),
    check('MOTHER_NAME').isAlpha().notEmpty().withMessage("Mother Name is required field"),
    check('YEAR').isInt().notEmpty().withMessage("Father Name is required field"),
    check('GRADE').isInt().notEmpty().withMessage("Father Name is required field"),
    check('SECTION').isAlpha().notEmpty().withMessage("Father Name is required field"),
  ],
  (req, res) => {
    try {
      const result = validationResult(req);
      if (result.isEmpty) {
        console.log(req.body)
        const result = db.run('INSERT INTO STUDENT(student_name,dob,address,phone,father_name,mother_name) VALUES(?,?,?,?,?,?)',
          [req.body.STUDENT_NAME, req.body.DOB, req.body.ADDRESS, req.body.PHONE, req.body.FATHER_NAME, req.body.MOTHER_NAME]
        );
        console.log("result", result);
        db.get('select max(student_id) student_id from student', (error, val) => {
          if (!error) {
            console.log("inserting details", val);
            db.run('INSERT INTO STUDENT_DETAILS(STUDENT_ID,YEAR,GRADE,SECTION,ROLL_NO) VALUES(?,?,?,?,?)',
              [val.student_id, req.body.YEAR, req.body.GRADE, req.body.SECTION, (req.body.YEAR + req.body.GRADE + req.body.SECTION)]
            );
          }
          else {
            res.status(500);
            res.send(error);
          }
        });
      } else {
        res.status(400);
        res.send("Field validations failed. Invalid fields");
      }
      res.status(200);
      res.send("Student created successfully");
    }
    catch (error) {
      res.status(500)
      res.send(error);
    }
  });

router.put('/', jsonParser,
  [
    check('STUDENT_NAME').isAlpha().notEmpty().withMessage("Student Name is required field"),
    check('DOB').isDate().notEmpty().withMessage("DOB is required field"),
    check('ADDRESS').isAlphanumeric().notEmpty().withMessage("Address is required field"),
    check('PHONE').isInt().notEmpty().withMessage("Phone is required field"),
    check('FATHER_NAME').isAlpha().notEmpty().withMessage("Father Name is required field"),
    check('MOTHER_NAME').isAlpha().notEmpty().withMessage("Mother Name is required field"),
    check('YEAR').isInt().notEmpty().withMessage("year is required field"),
    check('GRADE').isInt().notEmpty().withMessage("grade is required field"),
    check('SECTION').isAlpha().notEmpty().withMessage("Section is required field"),
  ],
  (req, res) => {
    if (req.body.STUDENT_ID === null || req.body.STUDENT_ID === -1) {
      try {
        const result = validationResult(req);
        if (result.isEmpty) {
          console.log('saving student details',req.body)
          const result = db.run('INSERT INTO STUDENT(student_name,dob,address,phone,father_name,mother_name) VALUES(?,?,?,?,?,?)',
            [req.body.STUDENT_NAME, req.body.DOB, req.body.ADDRESS, req.body.PHONE, req.body.FATHER_NAME, req.body.MOTHER_NAME], (error) => {
              if (error) {
                console.log("Error saving student details", error);
              }
            });
          console.log("result", result);
          db.get('select max(student_id) student_id from student', (error, val) => {
            if (!error) {
              console.log("inserting details", val);
              db.run('INSERT INTO STUDENT_DETAILS(STUDENT_ID,YEAR,GRADE,SECTION,ROLL_NO) VALUES(?,?,?,?,?)',
                [val.student_id, req.body.YEAR, req.body.GRADE, req.body.SECTION, req.body.ROLL_NO]
              );
            }
            else {
              res.status(500);
              res.send(error);
            }
          });
        } else {
          res.status(400);
          res.send("Field validations failed. Invalid fields");
        }
        res.status(200);
        res.send("Student created successfully");
      }
      catch (error) {
        res.status(500)
        res.send(error);
      }
    } else {
      try {
        const result = validationResult(req);
        if (result.isEmpty) {
          console.log('updating student details',req.body)
          db.run('UPDATE STUDENT SET STUDENT_NAME=?,DOB=?,ADDRESS=?,PHONE=?,FATHER_NAME=?,MOTHER_NAME=? WHERE STUDENT_ID = ?',
            [req.body.STUDENT_NAME, req.body.DOB, req.body.ADDRESS, req.body.PHONE, req.body.FATHER_NAME, req.body.MOTHER_NAME, req.body.STUDENT_ID], (error) => {
              if (error) {
                console.log("Error saving student details", error);
              }
            }
          );
          db.run('UPDATE STUDENT_DETAILS SET YEAR=?,GRADE=?,SECTION=?,ROLL_NO=? WHERE STUDENT_ID=? AND DTL_ID =?',
            [req.body.YEAR, req.body.GRADE, req.body.SECTION, req.body.ROLL_NO, req.body.STUDENT_ID, req.body.DTL_ID], (error) => {
              if (error) {
                console.log("Error saving student details", error);
              }
            });
        } else {
          res.status(400);
          res.send("Field validations failed. Invalid fields");
        }
        res.status(200);
        res.send("Student updated successfully");
      }
      catch (error) {
        console.log("Error saving student details", error);
        res.status(500)
        res.send(error);
      }
    }
  });

router.delete('/:STUDENT_ID', jsonParser,
  [
    check('STUDENT_ID').isNumeric().notEmpty().withMessage("Student id is required field"),
  ],
  (req, res) => {
    try {
      const result = validationResult(req);
      if (result.isEmpty) {

        db.run('DELETE from STUDENT_VACCINATION_DRIVE where STUDENT_ID= ?',
          [req.params.STUDENT_ID]
        );
        db.run('DELETE from student_DETAILS where STUDENT_ID= ?',
          [req.params.STUDENT_ID]
        );
        db.run('DELETE from student where STUDENT_ID= ?',
          [req.params.STUDENT_ID]
        );
        res.status(200);
        res.send("Deleted successfully");
      }
      else {
        res.status(400);
        res.send("Field validations failed. Invalid fields");
      }
    }
    catch (error) {
      res.status(500)
      res.send(error);
    }
  });


module.exports = router;