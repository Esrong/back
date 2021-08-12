const MONGOOSE = require('mongoose');
// const Schema =mongoose.Schema;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
// const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

var deathRegistration = MONGOOSE.Schema({
    // id:{type:STRING},
    
    reason:{type:STRING},
    place:{type:STRING},
    evidance:{type:STRING},
    region:{type: STRING},
    countDeath:{type:NUMBER, default:0},
    deathDate:{type:Date},
    details:[{type:OBJECT_ID, ref:'CIVIL'}],
    registrationDate: { type: Date, default: Date.now },

});

const Death = MONGOOSE.model('DEATH',deathRegistration);
 module.exports = Death;