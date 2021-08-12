const MONGOOSE = require('mongoose');
// const Schema =mongoose.Schema;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;
var mongoose;

var schemaName = MONGOOSE.Schema({
    image: {                                // <--- nested document (not sub document)
        modificationDate: {type: Date},
        name: {type: String},
        size: {type: Number},
        type: {type: String},
        filename: {type: String}
    },
    modificationDate: {type: Date, "default": Date.now}
});


const Image = MONGOOSE.model('IMAGE',schemaName);
 module.exports = Image;

