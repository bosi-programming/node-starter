const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Node Init',
    description: 'Description',
  },
  securityDefinitions: {
    apiKeyAuth: {
      type: 'Token',
      in: 'header',
      name: 'x-access-token',
      description: 'Add a token from a user to continue',
    },
  },
};

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/controllers/user.ts', './src/controllers/login.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
