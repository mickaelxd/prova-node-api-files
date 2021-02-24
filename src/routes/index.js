const { Router } = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const videoRouter = require('./video.routes');
const imageRouter = require('./image.routes');

const routes = Router();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {
        flags: 'a',
    }
);

routes.use(morgan('common', { stream: accessLogStream }));

routes.use('/image', imageRouter);
routes.use('/video', videoRouter);

routes.use((req, res, next) => {
    res.status(404).json({
        error: true,
        message: 'Route not found',
    });
});

module.exports = routes;
