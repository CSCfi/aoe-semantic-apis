import express from 'express';
import compression from 'compression'; // compress requests
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cors from 'cors';

import router from './routes';
import { client, updateRedis } from './util/redis.utils';

dotenv.config();

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

// Configuration
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 3000);

if (app.get('env') === 'development') {
    app.use(cors());
}

client.on('error', (error: any) => {
    console.error(error);
});

client.on('connect', async () => {
    await updateRedis();
});

// set cron jobs to run daily/weekly
cron.schedule('0 0 0 * * *', async () => {
    console.log('Running cron job');
    await updateRedis();
});

// Prefixed routes
app.use('/api/v1', router);

// Swagger
const options = {
    swaggerDefinition: {
        info: {
            description: 'Koodisto microservice',
            title: 'koodisto-service',
            version: '2.3.2',
        },
        host: 'aoe.fi',
        basePath: '/ref/api/v1',
        produces: ['application/json'],
        schemes: ['https'],
    },
    basedir: __dirname, // app absolute path
    files: ['./routes.js'], // Path to the API handle folder
};
expressSwagger(options);

export default app;
