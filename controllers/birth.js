const Birth = require('mongoose').model('BIRTH');
const Civil =require('mongoose').model('CIVIL')
const Marriage=require('mongoose').model('MARRIAGE')
const express = require('express');
const router = express.Router();


 //route

 router.get('/getBirth/:birthId',getSingle);
 router.get('/getAll',getAll)
 router.put('/edit/:birthId',edit);
 router.delete('/delete/:birthId',deleteBirth);
 router.post('/addBirth/:marriageId',addB);
 router.post('/adption/:civilId',adoption);
 router.get('/search/:query',search);

 module.exports=  router;


    
  function  getSingle(req,res){
        let birthId = req.params.birthId;
        Birth.findById(birthId).then((birth)=>{

            if(!birth){
                return res.status(400).json({
                    message:'There is no civil registred with given id in our database.'
                });
            }

            return res.status(200).json({
                message:' ',
                data:birth
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
        Birth.find((error, data) => {
            if (error) {
              return next(error)
            } else {
              res.json(data)
            }
          })

    }
function adoption(req,res){
    
    let civilId=req.params.civilId;
    let birth=req.body;
    Civil.findById(civilId).then((civil)=>{
        if(!civil){
            return res.status(400).json({
                message:`the Civil id with ${civilId} who adopt this child is not found`
            })
        }
        Birth.create(birth).then((births)=>{

            births.otherThanParent=civil._id;       

            births.save().then(()=>{
                Birth.findById(births._id).then((birth)=>{
                    if(!birth){ return;

                    }
                    civil.child.push(birth);
                    civil.save();
                    
                  return res.status(200).json({
                        message:"Birth is added secussfully",
                        data: birth
                    })
                })
            })
           
    })

            
           
    })
}
function edit(req,res){
    let birthId=req.params.birthId;
    let editedBirth=req.body;
    Birth.findById(birthId).then((birth)=>{
        if(!birth){
            return res.status(400).json({
                massage:'there is no Birth registered with this id'
            });
        }
        birth.name=editedBirth.name;
        birth.fname=editedBirth.fname;
        birth.gname=editedBirth.gname;
        birth.gender=editedBirth.gender;
        birth.birthDate=editedBirth.birthDate;
        birth.age=editedBirth.age;
        birth.birthPlace=editedBirth.birthPlace;
        birth.birthType=editedBirth.birthType;
        birth.birthAid=editedBirth.birthAid;
        birth.ethnicOrigin=editedBirth.ethnicOrigin;
        birth.citizenship=editedBirth.citizenship;
        birth.otherThanParent=editedBirth.otherThanParent;
        birth.region=editedBirth.region;
        birth.wereda=editedBirth.wereda;
        birth.zone=editedBirth.zone;
        birth.kebele=editedBirth.kebele;
        birth.fatherInfo=editedBirth.fatherInfo;
        birth.motherInfo=editedBirth.motherInfo;
        birth.save();
        return res.status(200).json({
            message:'birth registration edited succes fully ',
            data:birth
        });
    })
    .catch((err)=>{
        console.log(err);
        return res.status(400).json({
            message:'something went wrong, please try again. ',
        });
    });
}
function deleteBirth (req,res){
    let birthId =req.params.birthId;
    Birth.findByIdAndRemove(birthId).then((deletebirth)=>{
        if(!deletebirth){
            return res.status(400).json({
                message:'There is no civil registred with given id in our database'
            });
        }
        return res.status(200).json({
            message:'registred birth is  deleted successfully. ',
            data:deletebirth
        });

    }).catch((err)=>{
        console.log(err);
        return res.status(400).json({
            message:'something went wrong, please try again.'
        });
    });

}
function addB(req,res){
    let marriageId=req.params.marriageId;
    let births=req.body;
    Marriage.findById(marriageId).then((marriages)=>{
        if(!marriages){
            return res.status(400).json({
                message:'marriage does not exist.'
            });

        }
        
        Birth.create(births).then((birth)=>{
            birth.fatherInfo=marriages.groom;
            birth.motherInfo=marriages.bride;
            birth.save().then(()=>{
                Birth.findById(birth._id).then((birth)=>{
                    if(!birth){ return;

                    }

                    marriages.child.push(birth);
                    marriages.save();
                    Civil.findById(marriages.groom).then((civil)=>{
                        if(!civil){
                            return res.status(400).json({
                                message:'civil does not exist.'
                            });

                        }
                        civil.child.push(birth);
                        civil.save();
                    })
                    Civil.findById(marriages.bride).then((civil)=>{
                        if(!civil){
                            return res.status(400).json({
                                message:'civil does not exist.'
                            });

                        }
                        civil.child.push(birth);
                        civil.save();
                    })
                    Civil.create(births);

                  return res.status(200).json({
                        message:"Birth is added secussfully",
                        data: birth
                    })
                })
            })
        })

    })
}
function search (req, res)  {
    let params = req.query;
    let searchParams = {
        query: {},
        sort: { creationDate: -1 },
        skip: null,
        // limit: PAGE_LIMIT,
    };

    if (params.query || typeof params.query === 'string') {
        let query = JSON.parse(params.query);
        searchParams.query = { $text: { $search: query['searchTerm'], $language: 'en' } };
    }

    if (params.sort) {
        searchParams.sort = JSON.parse(params.sort);
    }

    if (params.skip) {
        searchParams.skip = JSON.parse(params.skip);
    }

    // if (params.limit) {
    //     searchParams.limit = JSON.parse(params.limit);
    // }

    Marriage
        .find(searchParams.query)
        .count()
        .then((count) => {
            Marriage
                .find(searchParams.query)
                .sort(searchParams.sort)
                .skip(searchParams.skip)
                // .limit(searchParams.limit)
                .then((result) => {
                    return res.status(200).json({
                        message: '',
                        data: result,
                        query: searchParams,
                        itemsCount: count
                    });
                })
                .catch(() => {
                    return res.status(400).json({
                        message: 'Bad Request!'
                    });
                });
        });
}