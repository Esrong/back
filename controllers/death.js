const Death = require('mongoose').model('DEATH');
const Civil = require('mongoose').model('CIVIL');
const express=require('express');
const router =express.Router();

router.get('/getDeath/:deathId',getSingle);
router.get('/getAll',getAll);
router.post('/add/:civilId',addDeath);
router.put('/edit/:deathId',edit);
router.delete('/delete/:deathId',deleteDeath);



module.exports=  router;


function  getSingle(req,res){
    let deathId = req.params.deathId;
    Death.findById(deathId).then((death)=>{

        if(!death){
            return res.status(400).json({
                message:'There is no civil registred with given id in our database.'
            });
        }

        return res.status(200).json({
            message:' ',
            data:death
        });
    })
    .catch((err)=>{
        console.log(err);
        return res.status(400).json({
            message:'something went wrong ,please try agaion or check your network'
        });
    });
}
function getAll(req,res){
    Death.find((error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })

}
function addDeath(req,res){
    let civilId=req.params.civilId;
    let death=req.body;
    Civil.findById(civilId).then((civil)=>{
        if(!civil){
            return res.status(400).json({
                message:`There is no Civil Registred with ID ${civilId}`,
                
                
            })
        }
        else if(civil.isDied==true){
            return res.status(400).json({
                message:`This civil already registred as Died`,
                
                
            })

        }
        Death.create(death).then((newdeath)=>{
            newdeath.details.push(civil);
            newdeath.save();
            return res.status(200).json({
                message:' ',
                data:newdeath
            });
            newdeath.save().then(()=>{
                Death.findById(newdeath._id).then((death)=>{
                    
                })
            })

        })
    })
}
function edit(req,res){
    let deathId=req.params.deathId;
    let editdeath=req.body;
    Death.findOneAndUpdate(deathId).then((death)=>{
        if(!death){
            return res.status(400).json({
                message:`there is not death registred with ID ${deathId}`
            })
        }
        death.details=editdeath.details;
        death.reason=editdeath.reason;
        death.place=editdeath.place;
        death.region=editdeath.region;
        death.evidance=editdeath.evidance;
        death.deathDate=editdeath.deathDate;
        death.save();
        return res.status(200).json({
            message:'death is updated successfully. ',
            data:death
        });

    })
}
function deleteDeath(req,res){
    let deathId =req.params.deathId;
    Death.findOneAndDelete(deathId).then((deletedeath)=>{
        if(!deletedeath){
            return res.status(400).json({
                message:'There is no death registred with given id in our database'
            });
        }
        return res.status(200).json({
            message:'registred death is  deleted successfully. ',
            data:deletedeath
        });

    }).catch((err)=>{
        console.log(err);
        return res.status(400).json({
            message:'something went wrong, please try again.'
        });
    });

}
