const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { check, checkExact, validationResult, query } = require('express-validator');

const router = express.Router();
router.use(express.static(path.join(__dirname, '../client/build')));

const db = new sqlite3.Database('VACCINATION_DB.db');
const jsonParser = bodyParser.json();

// Get all drives
router.get('/', async (req, res) => {
    try {
        const drives = db.all('SELECT DRIVE.*, DRIVE_DETAILS.DRIVE_DATE, DRIVE_DETAILS.VACC_ID, DRIVE_DETAILS.COMPLETED FROM DRIVE LEFT JOIN DRIVE_DETAILS ON DRIVE.DRIVE_ID = DRIVE_DETAILS.DRIVE_ID', (error, rows) => {
            if (!error) {
                console.log("getting drive data");
                res.status(200);
                res.send(rows);
            } else {
                res.status(500);
                res.send(error);
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single drive by ID
router.get('/:id', async (req, res) => {
    try {
        const drive = await db.get(`
            SELECT DRIVE.*, DRIVE_DETAILS.* 
            FROM DRIVE
            LEFT JOIN DRIVE_DETAILS ON DRIVE.DRIVE_ID = DRIVE_DETAILS.DRIVE_ID
            WHERE DRIVE.DRIVE_ID = ?
        `, [req.params.id]);
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }
        res.json(drive);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new drive
router.post('/', async (req, res) => {
    console.log("Request body:", req.body); // Debugging log
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).send("Invalid request body");
    }
    const { DRIVE_START_DATE, DRIVE_END_DATE, GRADES, DRIVE_NAME, DRIVE_DATE, VACC_ID, BATCH_NO } = req.body;
    try {
        const result = await db.run(`
            INSERT INTO DRIVE (DRIVE_START_DATE, DRIVE_END_DATE, GRADES, DRIVE_NAME) 
            VALUES (?, ?, ?, ?)
        `, [DRIVE_START_DATE, DRIVE_END_DATE, GRADES, DRIVE_NAME]);

        await db.run(`
            INSERT INTO DRIVE_DETAILS (DRIVE_DATE, DRIVE_ID, VACC_ID, BATCH_NO)
            VALUES (?, ?, ?, ?)
        `, [DRIVE_DATE, result.lastID, VACC_ID, BATCH_NO]);

        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a drive
router.put('/', 
     [
        check('DRIVE_ID').optional().isInt().withMessage('DRIVE_ID must be an integer'),
        check('DRIVE_NAME').notEmpty().withMessage('DRIVE_NAME is required'),
        check('GRADES').notEmpty().withMessage('GRADES is required'),
        check('DRIVE_START_DATE').notEmpty().withMessage('DRIVE_START_DATE is required'),
        check('DRIVE_END_DATE').notEmpty().withMessage('DRIVE_END_DATE is required'),
        check('DRIVE_DATE').notEmpty().withMessage('DRIVE_DATE is required'),
        check('VACC_ID').notEmpty().withMessage('VACC_ID is required'),
    ],
    async (req, res) => {
        console.log("inserting here", req.body);
        if (req.body.DRIVE_ID === undefined || req.body.DRIVE_ID === null || req.body.DRIVE_ID === -1) {
            try {
                console.log("inserting drive details", req.body);
                const result = validationResult(req);
                if (result.isEmpty()) {
                    console.log(req.body);
                    const result = db.run('INSERT INTO DRIVE (DRIVE_NAME, GRADES, DRIVE_START_DATE, DRIVE_END_DATE) VALUES (?, ?, ?, ?)'
                        , [req.body.DRIVE_NAME, req.body.GRADES, req.body.DRIVE_START_DATE, req.body.DRIVE_END_DATE]);
                    console.log("result", result);
                    db.get('select max(DRIVE_ID) DRIVE_ID from DRIVE', (error, val) => {
                        if (!error) {
                            console.log("inserting details", val);
                            db.run('INSERT INTO DRIVE_DETAILS (DRIVE_DATE, DRIVE_ID, VACC_ID, COMPLETED) VALUES (?, ?, ?, ?)'
                                , [req.body.DRIVE_DATE, val.drive_id, req.body.VACC_ID, req.body.COMPLETED]);
                            res.status(200);
                            res.send("Student created successfully");
                        }
                        else {
                            res.status(500);
                            res.send(error);
                        }
                    });
                } else {
                res.status(400);
                res.send("Field validations failed. Invalid fields", result.array());
            } 
            }
        catch (error) {
            res.status(500)
            res.send(error);
        }
    }
    else {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                console.log(req.body);
                const result = db.run(' UPDATE drive SET DRIVE_NAME = ?, DRIVE_END_DATE = ?, DRIVE_START_DATE = ?, GRADES = ? WHERE DRIVE_ID = ?',
                    [req.body.DRIVE_NAME, req.body.DRIVE_END_DATE, req.body.DRIVE_START_DATE, req.body.GRADES, req.body.DRIVE_ID], (error) => {
                        if (error) {
                            console.log("Error saving drive details", error);
                        }
                    }
                );
                db.run('UPDATE DRIVE_DETAILS SET VACC_ID = ?,COMPLETED = ?, DRIVE_DATE = ?, DRIVE_ID = ? WHERE DRIVE_DTLS_ID = ? ',
                    [req.body.VACC_ID,req.body.COMPLETED, req.body.DRIVE_DATE, req.body.DRIVE_ID, req.body.DRIVE_DTLS_ID], (error) => {
                    if (error) {
                        console.log("Error saving drive details", error);
                    }
                });
                res.status(200);
                res.send("Drive updated successfully");
            }
            else {
                res.status(400);
                res.send("Field validations failed. Invalid fields", result.array());
            }

        } catch (error) {
            console.log("Error saving drive details", error);
            res.status(500);
            res.send(error);
        }
    }
});

// Delete a drive
router.delete('/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM DRIVE_DETAILS WHERE DRIVE_ID = ?', [req.params.id]);
        const result = await db.run('DELETE FROM DRIVE WHERE DRIVE_ID = ?', [req.params.id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Drive not found' });
        }
        res.json({ message: 'Drive deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:driveId/:studentId', async (req, res) => {
    try {
        const result = db.run('INSERT into STUDENT_VACCINATION_DRIVE (DRIVE_ID, STUDENT_ID) values (?,?)', [req.params.driveId, req.params.studentId]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Drive not found' });
        }
        res.status(200);
        res.send("Student added to drive successfully");
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;