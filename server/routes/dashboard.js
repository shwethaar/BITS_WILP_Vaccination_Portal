const express = require('express')
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { check, checkExact, validationResult, query } = require('express-validator');

const router = express.Router()
router.use(express.static(path.join(__dirname, '../client/build')));

const db = new sqlite3.Database('VACCINATION_DB.db');
const jsonParser = bodyParser.json();

router.get('/student-vacc-info', (req, res) => {
    try{
    console.log("getting student vaccination info");
    const query = 'select s.student_id, s.student_name, sdtls.roll_no, sdtls.grade, d.drive_name, ddtls.drive_date, v.vaccine_name, ddtls.COMPLETED from STUDENT_VACCINATION_DRIVE svd  join STUDENT s on s.STUDENT_ID = svd.STUDENT_ID  join STUDENT_DETAILS sdtls on sdtls.student_id = s.STUDENT_ID  join drive d on d.drive_id = svd.drive_id  join DRIVE_DETAILS ddtls on ddtls.drive_id = d.drive_id  join VACCINE v on v.vacc_id = ddtls.vacc_id';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send(err) ;
        }
        console.log("Query result:", rows);
        res.status(200).send(rows);
    });
}
    catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.get('/grade-counts', (req, res) => {
    try{
    console.log("getting student grade counts");
    const query = `SELECT 
  sdtls.grade, v.vaccine_name,
  COUNT(CASE WHEN ddtls.COMPLETED = 'Yes' THEN 1 END) AS vaccinated,
  COUNT(CASE WHEN ddtls.COMPLETED = 'No' THEN 1 END) AS not_vaccinated
FROM STUDENT_VACCINATION_DRIVE svd
JOIN STUDENT s ON s.STUDENT_ID = svd.STUDENT_ID  
JOIN STUDENT_DETAILS sdtls ON sdtls.student_id = s.STUDENT_ID  
JOIN DRIVE d ON d.drive_id = svd.drive_id  
JOIN DRIVE_DETAILS ddtls ON ddtls.drive_id = d.drive_id 
JOIN VACCINE v ON v.vacc_id = ddtls.vacc_id
GROUP BY sdtls.grade, v.VACCINE_NAME
ORDER BY sdtls.grade;`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send(err) ;
        }
        res.status(200).send(rows);
    });
}
    catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.get('/ongoing-drives', (req, res) => {
    try{
    console.log("getting drive counts");
    const query = `select drive_id, drive_name, DRIVE_START_DATE, drive_end_date from drive where DRIVE_END_DATE>date() and DRIVE_START_DATE<date();`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send(err);
        }
        res.status(200).send(rows);
    });
}
    catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.get('/upcoming-drives', (req, res) => {
    try{
    console.log("getting drive counts");
    const query = `select drive_id, drive_name, drive_start_date, drive_end_date from drive where DRIVE_START_DATE>date();`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send(err);
        }
        res.status(200).send(rows);
    });
}
    catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.get('/available-vaccines', (req, res) => {
    try{
    console.log("getting available vaccines");
    const query = `select VACCINE_NAME, count(vaccine_name) count from vaccine join DRIVE_DETAILS on DRIVE_DETAILS.VACC_ID = VACCINE.VACC_ID group by vaccine.VACCINE_NAME;`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send(err);
        }
        res.status(200).send(rows);
    });
}
    catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;