
const express = require('express');
const router = express.Router();
 
const Divorce = require('mongoose').model('DIVORCE');
const Marriage = require('mongoose').model('MARRIAGE');
// const Marriage =require('mongoose').model('MARRIAGE');
const Civil =require('mongoose').model('CIVIL');



router.post('/add/:marriageId',addDivorce);
router.put('/edit/:divorceId',editDivorce);
router.get('/get/:divorceId',getDivorce);
router.get('/getAll',getAll);
router.delete('/delete/:divorceId',deleteDivorce);

module.exports=  router;

function getAll(req,res){
    Divorce.find((error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
}

function getDivorce(req,res){
    let divorceId= req.params.divorceId;

    Divorce.findById(divorceId).then((divorce)=>{
        if(!divorce){
            return res.status(400).json({
                message:"there is no divorce with this id",

            })
        }
        return res.status(200).json({
            message: "Here the data",
            data:divorce
        })
    })

}
function deleteDivorce(req,res){
    let divorceId= req.params.divorceId;

    Divorce.findByIdAndRemove(divorceId).then((divorce)=>{
        if(!divorce){
            return res.status(400).json({
                message:"there is no divorce with this id",

            })
        }
        Civil.findById(divorce.malePartner).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    message:"divorce not registred"
                })
            }
            civil.isDivorced=false;
            civil.isMarried=true;
            civil.save();
        })
        Civil.findById(divorce.femalePartner).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    message:"divorce not registred"
                })
            }
            civil.isDivorced=false;
            civil.isMarried=true;
            civil.save();
        })
        return res.status(200).json({
            message: "Here the data you have deleted",
            data:divorce
        })
    })

}

function addDivorce(req,res){
    let marriageId=req.params.marriageId;
    let divorce=req.body;
    Marriage.findById(marriageId).then((marriage)=>{
        if(!marriage){
            return res.status(400).json({
                message:"there is no marriage"
            })
        }
        Civil.findById(marriage.groom).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    message:"divorce not registred"
                })
            }
            civil.isMarried=false;
            civil.isDivorced=true;
            civil.save();
        })
        Civil.findById(marriage.bride).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    message:"divorce not registred"
                })
            }
            civil.isMarried=false;
            civil.isDivorced=true;
            civil.save();
        })

        Divorce.create(divorce).then((newDivorce)=>{
            newDivorce.malePartner=marriage.groom;
            newDivorce.femalePartner=marriage.bride;
            newDivorce.countDivorce +=1;
            marriage.countMarriage -=1;
        
            // marriage.isDivorce=true;
        //     groom._id = isDivorce=true;
        //    bride._id= isMarried=false;
        //    groom.save();
        //    bride.save();
            // marriage.isMarried=false;
            
            // marriage.save();
        
            newDivorce.save().then(()=>{
               Divorce.findById(newDivorce._id).then((divorce)=>{
                   if(!divorce){
                       return res.status(400).json({
                           message:"divorce not registred"
                       })
                   }
                   return res.status(200).json({
                       message:"The divorce Data is here",
                       data:divorce
                   })
               })
           })
        })
    })
}
function editDivorce(req,res){
    let divorceId=req.params.divorceId;
    let divorcee=req.body;
    Divorce.findById(divorceId).then((divorce)=>{
        if(!divorce){
            return res.status(400).json({
                message:`There is no divorce with id ${divorceId}`
            })
        }
       
        divorce.place=divorcee.place;
        divorce.reason=divorcee.reason;
        divorce.religion=divorcee.religion;
        divorce.region=divorcee.region;
        divorce.divorceInfo=divorcee.divorceInfo;
        divorce.malePartner=divorcee.malePartner;
        divorce.femalePartner=divorcee.femalePartner;
        divorce.divorceDate=divorcee.divorceDate;
        divorce.save();
        return res.status(200).json({
            message:"The Divorce Updated successfully",
            data:divorce
        })

    })
    
}