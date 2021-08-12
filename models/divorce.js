const MONGOOSE = require('mongoose');
// const Schema =mongoose.Schema;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

var divorceRegistration = MONGOOSE.Schema({
    
    place:{type:STRING},
    reason:{type:STRING},
    religion:{type:STRING},
    region:{type: STRING},
    divorceInfo:{type:STRING},
    divorceDate:{type:Date},
    malePartner:[{type:OBJECT_ID, ref:'CIVIL'}],
    femalePartner:[{type:OBJECT_ID, ref:'CIVIL'}],
    countDivorce:{type:NUMBER,default: 0},
    registrationDate: { type: Date, default: Date.now },

});

const Divorce = MONGOOSE.model('DIVORCE',divorceRegistration);
 module.exports = Divorce;