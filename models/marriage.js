const MONGOOSE = require('mongoose');
// const Schema =mongoose.Schema;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
// const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

var marriageRegistration = MONGOOSE.Schema({
    // id:{type:STRING},
    place:{type:STRING},
    marriageDate:{type:Date},
    marriageForm:{type:STRING},
    region:{type: STRING},
    groom:[{type:OBJECT_ID, ref:'CIVIL'}],
    bride:[{type:OBJECT_ID, ref:'CIVIL'}],
    child:[{type:OBJECT_ID,ref:'BIRTH'}],
    brideWitnessOne:[{type:OBJECT_ID, ref:'CIVIL'}],
    brideWitnessTwo:[{type:OBJECT_ID, ref:'CIVIL'}],
    groomWitnessOne:[{type:OBJECT_ID, ref:'CIVIL'}],
    groomWitnessTwo:[{type:OBJECT_ID, ref:'CIVIL'}],
    countMarriage:{type: NUMBER,default:0},
    registrationDate: { type: Date, default: Date.now },

});

const Marrige = MONGOOSE.model('MARRIAGE',marriageRegistration);
 module.exports = Marrige;