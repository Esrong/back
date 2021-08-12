const { ObjectID } = require('mongodb');
const MONGOOSE = require('mongoose');
// const Schema =mongoose.Schema;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

var birthRegistration = MONGOOSE.Schema({
    id:{type:STRING},
    name:{type:STRING},
    fname:{type:STRING},
    gname:{type:STRING},
    gender:{type:STRING},

    birthDate:{type:Date},
    age:{type:NUMBER},
    birthPlace:{type:STRING},
    birthType:{type:STRING},
    birthAid:{type:STRING},
    ethnicOrigin:{type:STRING},
    citizenship:{type:STRING}, 
    region:{type: STRING},
    religion:{type:STRING},
    zone:{type:STRING},
    wereda:{type:STRING},
    kebele:{type:STRING},
    fatherInfo:{type:OBJECT_ID,ref:'CIVIL'},
    motherInfo:{type:OBJECT_ID,ref:'CIVIL'},
    otherThanParent:{type:OBJECT_ID, ref:'CIVIL'},
    countBirth:{type:NUMBER,default:1},
    registrationDate: { type: Date, default: Date.now },
});

const Birth =MONGOOSE.model('BIRTH',birthRegistration);
 module.exports = Birth;