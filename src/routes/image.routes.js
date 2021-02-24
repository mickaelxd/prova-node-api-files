const { Router } = require('express');
const fs = require('fs');

const imageRouter = Router();

imageRouter.get('/', (req, res) => {
    res.status(403).json({
        error: true,
        message: 'You should send an Id after the last slash',
    });
});

imageRouter.get('/:id', (req, res) => {
    const path = `src/assets/images/${req.params.id}.jpg`;

    if (!fs.existsSync(path)) {
        return res.status(404).json({
            error: true,
            message: `The image with id ${req.params.id} does not exist`,
        });
    }

    const options = {
        encoding: 'base64',
    };

    const base64 = fs.readFileSync(path, options);

    return res.status(200).json({
        filename: req.params.id,
        base64,
    });
});

imageRouter.delete('/:id', (req, res) => {
    const path = `src/assets/images/${req.params.id}.jpg`;

    try {
        fs.unlinkSync(path);
        res.send();
    } catch (err) {
        console.error(err);
    }
});

module.exports = imageRouter;
