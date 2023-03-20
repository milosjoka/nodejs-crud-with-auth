require('dotenv').config();

const express = require('express');
const checkJWTToken = require('./middlewares/check-jwt.middleware');

const cors = require('cors');

const app = express();

const morgan = require('./middlewares/request-logger.middleware');
const errorLogger = require('./middlewares/error-logger.middleware');
const errorHandler = require('./middlewares/error-handler.middleware');

const logger = require('./services/winston.service');
const HTTP_STATUS_CODE = require('./exceptions/http-status.code');

const process = require('node:process');

process.on('uncaughtException', (err, origin) => {
    logger.error({
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: `Caught exception: ${err.message || 'Internal Server Error!'} \nException origin: ${origin}`,
        stack: err.stack
    });
});

process.on('unhandledRejection', (err, origin) => {
    logger.error({
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: `Unhandled rejection: ${err.message || 'Internal Server Error!'} \nException origin: ${origin}`,
        stack: err.stack
    });
});


const db = require('./models/index');
db.sequelize.authenticate()
    .then(() => {
        // Body Parser Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Cors
        app.use(cors());

        // Request Logger
        app.use(morgan(':custom-request-logger'));

        // Auth resource API Routes
        app.use('/api/auth', require('./routes/api/auth'));

        // User resource API Routes
        app.use('/api/users', checkJWTToken, require('./routes/api/users'));

        // Group resource API Routes
        app.use('/api/groups', checkJWTToken, require('./routes/api/groups'));

        // Error logger & handler
        app.use(errorLogger);
        app.use(errorHandler);

        const PORT = process.env.PORT;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => {
        console.log(`DB authentication failed: ${  err.message}`);
    });

