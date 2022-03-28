//require('dotenv').config()
//var multer  = require('multer')
//
//const {GridFsStorage} = require('multer-gridfs-storage');
//const url = process.env.DB;
//
//
//// Create a storage object with a given configuration
//const storage = new GridFsStorage({url: url,
//  options: { useNewUrlParser: true, useUnifiedTopology: true }});
//
//
//var upload = multer({ storage }).fields([{ name: 'docs'}, { name: 'audioFiles'}]);
//
//module.exports = {upload};


require('dotenv').config();
var multer  = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');


// create storage engine
const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const pId = req.body.id;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    pId: pId,
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });
module.exports = {upload};


//const multer = require("multer");
//const GridFsStorage = require("multer-gridfs-storage");
//
//const storage = new GridFsStorage({
//    url: process.env.DB,
//    options: { useNewUrlParser: true, useUnifiedTopology: true },
//    file: (req, file) => {
//        const match = ["image/png", "image/jpeg"];
//
//        if (match.indexOf(file.mimetype) === -1) {
//            const filename = `${Date.now()}-any-name-${file.originalname}`;
//            return filename;
//        }
//
//        return {
//            bucketName: "photos",
//            filename: `${Date.now()}-any-name-${file.originalname}`,
//        };
//    },
//});
//
//module.exports = multer({ storage });