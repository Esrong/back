const MONGOOSE = require('mongoose');

const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

var civilRegistration = MONGOOSE.Schema({
    id:{type:STRING},  
    name:{type:STRING},
    fname:{type:STRING},
    gname:{type:STRING},
    gender:{type:STRING},
    image:{type:STRING},
    birthDate:{type:Date},
    age:{type:NUMBER},
    birthPlace:{type:STRING},
    citizenship:{type:STRING}, 
    ethnicOrigin:{type:STRING},
    religion:{type:STRING},
    region:{type: STRING},
    zone:{type:STRING},
    wereda:{type:STRING},
    kebele:{type:STRING},
    countCivil:{type:NUMBER,default:1},
    child:[{type:OBJECT_ID,ref:"BIRTH"}],
    isMarried: { type: BOOLEAN, default: false },
    isDied: { type: BOOLEAN, default: false },
    isDivorced:{type:BOOLEAN,default:false},
    registrationDate: { type: Date, default: Date.now },


});

const Civil =MONGOOSE.model('CIVIL',civilRegistration);
 module.exports = Civil;