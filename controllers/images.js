// const Civil = require('mongoose').model('CIVIL');
const Image = require("mongoose").model('IMAGE')
const  fs = require('fs')
const express = require('express');
const router = express.Router();


// import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
 //route

 router.post('/images', create);
 router.post('/upload', upload);

 // RETRIEVE
 router.get('/images', list);
 router.get('/images/:_id',detail);

 // UPDATE
 router.put('/images/:_id',update);

 // DELETE
 router.delete('/images/:_id',deleted);




module.exports=  router;



// CREATE
function upload (req, res) {

    var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var newPath = [__dirname, '..', '..' , '..', 'client', 'images', 'uploads', '', filename].join(separator);

    console.log('>>>>>');
    console.log('__dirname', __dirname);
    console.log('oldPath', oldPath);
    console.log('newPath: ', newPath);
    console.log('filename: ', filename);

    fs.rename(oldPath, newPath, function (err) {
        if (err === null) {
            var image = {
                image: {
                    modificationDate: req.files.myFile.modifiedDate || new Date(),
                    name: req.files.myFile.name || "???",
                    size: req.files.myFile.size || 0,
                    type: req.files.myFile.type || "???",
                    filename: filename
                }
            };
            doc = new Image(image);

            console.log('Renaming file to ', req.files.myFile.name);

            doc.save(function (err) {

                var retObj = {
                    meta: {"action": "upload", 'timestamp': new Date(), filename: __filename},
                    doc: doc,
                    err: err
                };
                return res.send(retObj);
            });
        }
    });
}

 function create (req, res) {

    console.log('CREATE image.');

    var doc = new Image(req.body);

    doc.save(function (err) {

        var retObj = {
            meta: {"action": "create", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };

        return res.send(retObj);

    });

}

// RETRIEVE
// Get all images
 function list (req, res) {
    var conditions, fields, options;

    // console.log('GET images.');

    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    Image
        .find(conditions, fields, options)
        .sort(sort)
        .exec(function (err, doc) {

            var retObj = {
                meta: {"action": "list", 'timestamp': new Date(), filename: __filename},
                doc: doc, // array
                err: err
            };

            return res.send(retObj);

        })
}

// Get 1 image
function detail (req, res) {
    var conditions, fields, options;

    console.log('GET image. ' + req.params._id);

    conditions = {_id: req.params._id}
        , fields = {}
        , options = {'createdAt': -1};

    Image
        .find(conditions, fields, options)
        .exec(function (err, doc) {
            var retObj = {
                meta: {"action": "detail", 'timestamp': new Date(), filename: __filename},
                doc: doc[0], // only the first document, not an array when using "find"
                err: err
            };
            return res.send(retObj);
        })
}

// UPDATE
function update (req, res) {

    console.log('Updating image...\n', req.params_id, req.body);

    var conditions =
        {_id: req.params._id}
        , update = {
            title: req.body.title || '',
            author: req.body.author || '',
            description: req.body.description || ''
        }
        , options = { multi: false }
        , callback = function (err, doc) {
            var retObj = {
                meta: {"action": "update", 'timestamp': new Date(), filename: __filename},
                doc: doc,
                err: err
            };
            return res.send(retObj);
        };

    Image
        .findOneAndUpdate(conditions, update, options, callback);
}


// DELETE
 function deleted (req, res) {
    var conditions, callback, retObj;

    console.log('Deleting image. ', req.params._id);

    conditions = {_id: req.params._id}
        , callback = function (err, doc) {
        retObj = {
            meta: {"action": "delete", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        return res.send(retObj);
    }

    Image
        .remove(conditions, callback);
}
