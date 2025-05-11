const express = require('express')
const app = express()
const path = require('path');
const sqlite3 = require('sqlite3');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

var cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


var studentRoutes = require('./routes/student');
app.use('/student', studentRoutes);

var driveRoutes = require('./routes/vaccDrives');
app.use('/vaccDrive', driveRoutes);

var vaccineRoutes = require('./routes/vaccines');
app.use('/vaccines', vaccineRoutes);

var dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes);


app.listen(8080, () => {
    console.log('Server started on port 8080');
});