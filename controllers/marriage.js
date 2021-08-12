const express = require('express');
const router = express.Router();

const Civil =require('mongoose').model('CIVIL');
// const civil2 =require('mongoose').model('CIVIL');
const Marriage =require('mongoose').model('MARRIAGE');

router.post('/add/:civilId/:civilId2',addMarriage);
router.delete('/delete/:marriageId',deleteMarriage);
router.put('/edit/:marriageId',editMarriage);
router.get('/get/:marriageId',getMarriage);
router.get('/getAll',getAll),
// router.get('/search',search),

router.post('/addWitness/:marriageId/:groomWitness/:groomWitness2/:brideWitness/:brideWitness2',addWitness);

module.exports=  router;

function getAll(req,res){
    Marriage.find((error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
}

function getMarriage(req,res){
    let marriageId= req.params.marriageId;

    Marriage.findById(marriageId).then((marriage)=>{
        if(!marriage){
            return res.status(400).json({
                message:"there is no marriage with this id",

            })
        }
        return res.status(200).json({
            message: "Here the data",
            data:marriage
        })
    }).catch((err)=>{
        console.log(err);
        return res.status(400).json({
            message:'Invalid Id or something went wrong ,please try agaion or check your network'
        });
    });

}


function addMarriage(req,res){
    let civilId=req.params.civilId;
    let civilId2=req.params.civilId2;
    // let civilId3=req.params.civilId3;
    // let civilId4=req.params.civilId4;
    // let civilId5=req.params.civilId5;
    // let civilId6=req.params.civilId6;
    let marriages=req.body;
    
    

    Civil.findById(civilId).then((civil)=>{
        if(!civil||civil.isMarried){
            return res.status(400).json({
                message:`There is no civil  ${civilId} registred with given params or sitizen is married`
            })
        }
        Civil.findById(civilId2).then((civil1)=>{
            if(!civil||civil.isMarried){
                return res.status(400).json({
                    message:`there is no civil ${civilId2}registred with given id or the citizen is marred`
                })
            }
            if(civilId2 == civilId){
                return res.status(400).json({
                    message:"He/She can not married to him/her self"
                })
            }  
            Marriage.create(marriages).then((newMarriage)=>{
                 
                newMarriage.groom =civil._id;
                newMarriage.bride=civil1._id;
                newMarriage.countMarriage +=1;
            
            
                civil.isMarried=true;
                civil1.isMarried=true;
               
              
                civil.save();
                civil1.save();
                marriages.countMarriage += 1;
                newMarriage.save().then(()=>{
                    Marriage.findById(newMarriage._id)
                    .then((marriages)=>{
                        // Civil.findById(civilId3,civilId4,civilId5,civilId6).then((civil3,civil4,civil5,civil6)=>{
                        //     if(!civil3||!civil4||!civil5||!civil6){
                        //         return res.status(400).json({
                        //             message:`the is no civi for witness`
                        //         })

                        //     }
                        //     newMarriage.groomWitnessOne = civil3._id;
                        //     newMarriage.groomWitnessTwo = civil4._id;
                        //     newMarriage.brideWitnessOne = civil5._id;
                        //     newMarriage.brideWitnessTwo = civil6._id;
                        //     civilId3.save();
                        //     civilId4.save();
                        //     civilId5.save();
                        //     civilId6.save();
                        //     newMarriage.save().then(()=>{
                        //         Marriage.findById(newMarriage._id).then((marriages)=>{
                        //             return res.status(200).json({
                        //                 message:'merriage is added  successfully happy widding',
                        //                 data:marriages
                        //             })
                                    
                        //         })
                        //     })
                        // });
                        return res.status(200).json({
                            message:'merriage is added successfully happy widding',
                            data:marriages
                        })
                    })
                })
                // newMarriage.bride.push(civilId2);
              
            })

        })
    
    })
   

}
function addWitness(req,res){
    let marriageId=req.params.marriageId;
    let groomWitness=req.params.groomWitness;
    let groomWitness2=req.params.groomWitness2
    let brideWitness=req.params.brideWitness;
    let brideWitness2=req.params.brideWitness2

    Marriage.findById(marriageId).then((marriage)=>{
        if(!marriage){
            res.status(400).json({
                message:`there is no marriage with this ${marriageId}  id number`
            })
        }
        Civil.findById(groomWitness).then((groom)=>{
            if(!groom){
                res.status(400).json({
                    message:`there is no civil registred with ${groomWitness} id`
                })
            }
            Civil.findById(groomWitness2).then((groom)=>{
                if(!groom){
                    res.status(400).json({
                        message:`there is no civil registred with ${groomWitness2} id`
                    })
                }
                Civil.findById(brideWitness).then((groom)=>{
                    if(!groom){
                        res.status(400).json({
                            message:`there is no civil registred with ${brideWitness} id`
                        })
                    }
                    Civil.findById(brideWitness2).then((groom)=>{
                        if(!groom){
                            res.status(400).json({
                                message:`there is no civil registred with ${brideWitness2} id`
                            })
                        }                       
                        marriage.brideWitnessOne.push(groomWitness);
                        marriage.brideWitnessTwo.push(groomWitness2);
                        marriage.groomWitnessOne.push(brideWitness);
                        marriage.groomWitnessTwo.push(brideWitness2);
                        marriage.save();
                        res.status(200).json({
                            message:"All wtness are added sucess fully",
                            data:marriage
                        })


                        
                    })
                    
                })
                
            })

        })
    })

}
function deleteMarriage(req,res){
    let marriageId =req.params.marriageId;
    Marriage.findByIdAndRemove(marriageId).then((marriage)=>{
        if(!marriage){
            return res.status(400).json({
                message:`There is no marriage to deletel with Id ${marriageId} `

            })
        }
        return res.status(200).json({
            message: `The marriage that have Id ${marriageId} deleted seccussfully`
        })
    }).catch((err) => {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    });

}
function editMarriage(req,res){
    let marriageId=req.params.marriageId;
    let marriage=req.body;
    Marriage.findById(marriageId).then((marriag)=>{
        if(!marriag){
            return res.status(400).json({
                message:`There is no merrage with Id ${marriageId} to edit`,
                
            })
        }
        marriag.place=marriage.place;
        marriag.marriageForm=marriage.marriageForm;
        marriag.marriageDate=marriage.marriageDate;
        marriag.region=marriage.region;
        marriag.groom=marriage.groom;
        marriag.bride=marriage.bride;
        marriag.child=marriage.child; 
        marriag.brideWitnessOne=marriage.brideWitnessOne;
        marriag.brideWitnessTwo=marriage.brideWitnessTwo;
        marriag.groomWitnessOne=marriage.groomWitnessOne;
        marriag.groomWitnessTwo=marriage.groomWitnessTwo;
        marriag.save();
        return res.status(200).json({
            message: 'marriage edited !',
            data:marriag
        });

    }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
}
function search (req, res)  {
    let params = req.query;
    let searchParams = {
        query: {},
        sort: { creationDate: -1 },
        skip: null,
        limit: PAGE_LIMIT,
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

    if (params.limit) {
        searchParams.limit = JSON.parse(params.limit);
    }

    Marriage
        .find(searchParams.query)
        .count()
        .then((count) => {
            Marriage
                .find(searchParams.query)
                .sort(searchParams.sort)
                .skip(searchParams.skip)
                .limit(searchParams.limit)
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
