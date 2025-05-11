const express = require('express')
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { check, checkExact, validationResult, query } = require('express-validator');

const router = express.Router();
router.use(express.static(path.join(__dirname, '../client/build')));

const db = new sqlite3.Database('VACCINATION_DB.db');
const jsonParser = bodyParser.json();

// Get all vaccines
router.get('/', async (req, res) => {
    try {
        const vaccines = await db.all(`
            SELECT V.*, VD.* 
            FROM VACCINE V
            LEFT JOIN VACCINE_DETAILS VD ON V.VACC_ID = VD.VACC_ID
        `, (error, rows) => {
            if (!error) {
                res.status(200);
                res.send(rows);
            }
            else {
                res.status(500);
                res.send(error);
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single vaccine by ID
router.get('/:id', async (req, res) => {
    try {
        const vaccine = await db.get(`
            SELECT V.*, VD.DETAILS 
            FROM VACCINE V
            LEFT JOIN VACCINE_DETAILS VD ON V.VACC_ID = VD.VACC_ID
            WHERE V.VACC_ID = ?
        `, [req.params.id]);
        if (!vaccine) {
            return res.status(404).json({ error: 'Vaccine not found' });
        }
        res.json(vaccine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new vaccine
router.post('/', jsonParser,
    [
        check('VACCINE_NAME').isAlpha().notEmpty().withMessage("Vaccine Name is a required field"),
        check('ACTIVE_SINCE').isDate().notEmpty().withMessage("Active Since is a required field"),
        check('EXPIRY_DATE').isDate().notEmpty().withMessage("Expiry Date is a required field"),
        check('STATUS').isAlpha().notEmpty().withMessage("Status is a required field"),
        check('BATCH_NO').isAlphanumeric().notEmpty().withMessage("Batch Number is a required field"),
        check('SERIAL_NUMBER').isAlphanumeric().notEmpty().withMessage("Serial Number is a required field"),
        check('DOSES_AVAILABLE').isInt().notEmpty().withMessage("Doses Available is a required field"),
    ],
    (req, res) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                console.log(req.body);
                const result = db.run('INSERT INTO VACCINE (VACCINE_NAME, ACTIVE_SINCE, EXPIRY_DATE, STATUS) VALUES (?, ?, ?, ?)'
                    , [req.body.VACCINE_NAME, req.body.ACTIVE_SINCE, req.body.EXPIRY_DATE, req.body.STATUS]);
                console.log("result", result);
                db.get('select max(VACC_ID) VACC_ID from vaccine', (error, val) => {
                    if (!error) {
                        console.log("inserting details", val);
                        db.run('INSERT INTO VACCINE_DETAILS (VACC_ID, BATCH_NO, SERIAL_NUMBER, DOSES_AVAILABLE) VALUES (?, ?, ?, ?)'
                            , [val.VACC_ID, req.body.BATCH_NO, req.body.SERIAL_NUMBER, req.body.DOSES_AVAILABLE]);
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

// Update a vaccine
router.put('/', jsonParser,
    [
        check('VACC_ID').isInt().notEmpty().withMessage("Vaccine ID is a required field"),
        check('VACCINE_NAME').isAlpha().notEmpty().withMessage("Vaccine Name is a required field"),
        check('ACTIVE_SINCE').isDate().notEmpty().withMessage("Active Since is a required field"),
        check('EXPIRY_DATE').isDate().notEmpty().withMessage("Expiry Date is a required field"),
        check('STATUS').isAlpha().notEmpty().withMessage("Status is a required field"),
        check('BATCH_NO').isAlphanumeric().notEmpty().withMessage("Batch Number is a required field"),
        check('SERIAL_NUMBER').isAlphanumeric().notEmpty().withMessage("Serial Number is a required field"),
        check('DOSES_AVAILABLE').isInt().notEmpty().withMessage("Doses Available is a required field"),
        check('VACC_DTLS_ID').isInt().notEmpty().withMessage("Vaccine Details ID is a required field"),
    ],
    async (req, res) => {
        if (req.body.VACC_ID === null || req.body.VACC_ID === -1) {
            try {
                const result = validationResult(req);
                if (result.isEmpty()) {
                    console.log(req.body);
                    const result = db.run('INSERT INTO VACCINE (VACCINE_NAME, ACTIVE_SINCE, EXPIRY_DATE, STATUS) VALUES (?, ?, ?, ?)'
                        , [req.body.VACCINE_NAME, req.body.ACTIVE_SINCE, req.body.EXPIRY_DATE, req.body.STATUS]);
                    console.log("result", result);
                    db.get('select max(vacc_id) vacc_id from vaccine', (error, val) => {
                        if (!error) {
                            console.log("inserting details", val);
                            db.run('INSERT INTO VACCINE_DETAILS (VACC_ID, BATCH_NO, SERIAL_NUMBER, DOSES_AVAILABLE) VALUES (?, ?, ?, ?)'
                                , [val.vacc_id, req.body.BATCH_NO, req.body.SERIAL_NUMBER, req.body.DOSES_AVAILABLE]);
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
        }
        else {
            try {
                const result = validationResult(req);
                if (result.isEmpty()) {
                    console.log(req.body);
                    const result = db.run(' UPDATE VACCINE SET VACCINE_NAME = ?, ACTIVE_SINCE = ?, EXPIRY_DATE = ?, STATUS = ? WHERE VACC_ID = ?',
                        [req.body.VACCINE_NAME, req.body.ACTIVE_SINCE, req.body.EXPIRY_DATE, req.body.STATUS, req.body.VACC_ID], (error) => {
                            if (error) {
                                console.log("Error saving vaccine details", error);
                            }
                        }
                    );
                    db.run('UPDATE VACCINE_DETAILS SET VACC_ID = ?, BATCH_NO = ?, SERIAL_NUMBER = ?, DOSES_AVAILABLE = ? WHERE VACC_DTLS_ID = ? ', [req.body.VACC_ID, req.body.BATCH_NO, req.body.SERIAL_NUMBER, req.body.DOSES_AVAILABLE, req.body.VACC_DTLS_ID], (error) => {
                        if (error) {
                            console.log("Error saving vaccine details", error);
                        }
                    });
                    res.status(200);
                res.send("Vaccine updated successfully");
                }
                else {
                    res.status(400);
                    res.send("Field validations failed. Invalid fields");
                }
                
            } catch (error) {
                console.log("Error saving vaccine details", error);
                res.status(500);
                res.send(error);
            }
        }
    });

// Delete a vaccine
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM VACCINE_DETAILS WHERE VACC_ID = ?', [req.params.id]);

        await db.run('DELETE FROM VACCINE WHERE VACC_ID = ?', [req.params.id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Vaccine not found' });
        }
        res.json({ message: 'Vaccine deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get vaccine details by vaccine ID
router.get('/:id/details', async (req, res) => {
    try {
        const details = await db.all(`
            SELECT V.*, VD.DETAILS 
            FROM VACCINE V
            LEFT JOIN VACCINE_DETAILS VD ON V.VACC_ID = VD.VACC_ID
            WHERE V.VACC_ID = ?
        `, [req.params.id]);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;