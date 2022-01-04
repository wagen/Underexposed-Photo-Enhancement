const express = require('express');
const app  = express();
const router = express.Router();
const multer = require('multer');
const upload = multer({
    dest: "./public/uploads/",
    limits: { fileSize: 5242880 }
});
const fs = require('fs');

router.get('/', (req, res) => {
    res.sendFile('home.html', {root: __dirname}, err => {
        if(err) res.status(500).send('Sorry, out of order');
    });
});

router.get('/processed/:id', (req, res) => {
    fs.access(`public/outputs/${req.params.id}`, fs.F_OK, err => {
        if (err) {
            return res.json({
                message: 'File not found'
            });
        }
        return res.json({
            message: 'File exist'
        });
    });
});

router.post('/upload', upload.single('image'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = `public/uploads/${req.file.originalname}`;
    fs.rename(tempPath, targetPath, err => {
        if(err) {
            console.log(err);
            res.status(500);
        } else {        
            res.json({
                message: 'File uploaded',
                filename: req.file.originalname
            });
        }
    });
});

app.use('/', router);
app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));