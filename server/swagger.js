const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/*.js'];
const doc = {
    info: {
        title: 'Vaccination API',
        description: 'Vaccination API Documentation',
    },
    host: 'localhost:8080',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
}

swaggerAutogen(outputFile, endpointsFiles, doc)