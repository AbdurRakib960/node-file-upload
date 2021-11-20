const express = require('express');
const multer = require('multer');
const path = require('path');

const UPLOAD_FOLDER = './uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-');
        // eslint-disable-next-line no-unused-expressions
        `-${Date.now()}`;

        cb(null, fileName + fileExt);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (
                // eslint-disable-next-line operator-linebreak
                file.mimetype === 'image/png' ||
                // eslint-disable-next-line operator-linebreak
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg, .png, .jpeg file allow'));
            }
        } else if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only pdf format allowed'));
            }
        } else {
            cb(new Error('There was an unknown error'));
        }
    },
});

const app = express();

app.post(
    '/',
    upload.fields([
        { name: 'avatar', maxCount: 2 },
        { name: 'doc', maxCount: 3 },
    ]),
    (req, res) => {
        res.send('hello world !');
        console.log(req.files);
        // eslint-disable-next-line prettier/prettier
    },
);

app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was a upload error');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('success');
    }
});

app.listen(3000, () => console.log('app listening on port 3000'));
