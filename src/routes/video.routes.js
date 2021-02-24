const { Router } = require('express');
const fs = require('fs');

const videoRouter = Router();

videoRouter.get('/', (req, res) => {
    res.status(403).json({
        error: true,
        message: 'You should send an Id after the last slash',
    });
});

videoRouter.get('/:id', (req, res) => {
    const path = `src/assets/videos/${req.params.id}.mp4`;

    if (!fs.existsSync(path)) {
        return res.status(404).json({
            error: true,
            message: `The video with id ${req.params.id} does not exist`,
        });
    }

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const { range } = req.headers;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        });
        return file.pipe(res);
    }

    res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    });
    return fs.createReadStream(path).pipe(res);
});

videoRouter.get('/download/:id', (req, res) => {
    const path = `src/assets/videos/${req.params.id}.mp4`;

    if (!fs.existsSync(path)) {
        return res.json({
            error: true,
            message: `The video with id ${req.params.id} does not exist for download`,
        });
    }

    return res.download(path, `${req.params.id}-${Date.now()}.mp4`);
});

videoRouter.delete('/:id', (req, res) => {
    const path = `src/assets/videos/${req.params.id}.mp4`;

    try {
        fs.unlinkSync(path);
        res.send();
    } catch (err) {
        console.error(err);
    }
});

module.exports = videoRouter;
