import express from 'express';

const app = express();

app.use(express.urlencoded({extended: true}));

import multer from 'multer';
//const upload = multer({dest: 'uploads/'});

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(undefined, 'uploads/')
    },
    filename: (req,file,cb)=>{
        console.log(file.originalname);
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        

        cb(undefined, uniquePrefix + file.originalname);
    }
});

const fileFilter = (req,file, cb) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];

    if(!validTypes.includes(file.mimetype)) {
        cb(new Error("Invalid file type "+ file.mimetype),false);
    } else {
        cb(null, true);
    }
}
    
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
    fileFilter : fileFilter
 })

app.post('/form', (req, res) => {
    console.log(req.body);
    delete req.body.password;
    res.send({data: req.body});
});

app.post('/fileform', upload.single('file'), (req, res) => {
    console.log(req.body);
    res.send({data: req.body});
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
    console.log('Server is running on port http://localhost:'+ PORT);
})