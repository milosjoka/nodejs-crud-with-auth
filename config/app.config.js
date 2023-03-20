const process = require('node:process');

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'NodeJSTraining'
};
