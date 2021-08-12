const Civil = require('mongoose').model('CIVIL');
const express = require('express');
const router = express.Router();


// import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
 //route

 router.get('/details/:civilId',getSingle);
 router.post('/add',add);
 router.get('/getAll',getAll)
 router.put('/edit/:civilId',edit);
 router.delete('/delete/:civilId',deleteCivil);
 router.get('/search',search);
 router.get('/age',getAge);
 router.get('/civilCount',civilColection);
 router.post('/Civil',get_some);

 router.get('/allCivil',allCivil);

//statistics
router.get('/civilStatistics',civilStatistics)



module.exports=  router;




function get_some (req, res, next) {
    const pgSz = +req.query.ps; // page size (civils per page)
    const pgNo = +req.query.pg; // page number (current page)
  
    let srch = req.query.search; // search string
  
    srch = srch ? `.*${req.query.search}.*` : '';
  
    let civils;
  
    const civilQuery = srch ? Civil.find({ name: {$regex: srch} }) : Civil.find(); 
  
    if (pgSz && pgNo) {
      civilQuery.skip(pgSz * (pgNo - 1)).limit(pgSz);
    }
  
    civilQuery.find()
      .then((documents) => {
        civils = documents;
        return Civil.estimatedDocumentCount();
      })
      .then((count) => {
        res.status(200).json({
          message: 'Civils fetched.',
          civils: civils,
          total: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Fecthing civils failed!'
        });
      });
};
    
  function  getSingle(req,res){
        let civilId = req.params.civilId;
        Civil.findById(civilId).then((civil)=>{

            if(!civil){
                return res.status(400).json({
                    message:'There is no civil registred with given id in our database.'
                });
            }

            return res.status(200).json({
                message:' ',
                data:civil
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
        Civil.find((error, data) => {
           
            if (error) {
              return next(error)
            } else {
              res.json(data)
            }
            
          })
         
          
    }
function add (req, res){
        let civil= req.body; 
            Civil.create(civil).then((newcivil)=>{
            return res.status(200).json({
                message:'civil Registred seccussfully',
                data: newcivil
            });
            

        }).catch((err)=>{
            console.log(err);
            return res.status(400).json({
                message:'something went wrong, please try again'
            })

        })
        
    }
    function edit(req,res){
        let civilId=req.params.civilId;
        let editedcivil=req.body;
        Civil.findById(civilId).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    massage:'there is no civil registered with this id'
                });
            }
            civil.name=editedcivil.name;
            civil.fname=editedcivil.fname;
            civil.gname=editedcivil.gname;
            civil.gender=editedcivil.gender;
            civil.birthDate=editedcivil.birthDate;
            civil.age=editedcivil.age;
            civil.civilPlace=editedcivil.civilPlace;
            civil.civilType=editedcivil.civilType;
            civil.civilAid=editedcivil.civilAid;
            civil.ethnicOrigin=editedcivil.ethnicOrigin;
            civil.religion=editedcivil.religion;
            civil.citizenship=editedcivil.citizenship;
            civil.region=editedcivil.region;
            civil.zone=editedcivil.zone;
            civil.wereda=editedcivil.wereda;           
            civil.kebele=editedcivil.kebele;
            civil.marital=editedcivil.marital;
            civil.save();
            return res.status(200).json({
                message:'civil registration edited succes fully ',
                data:civil
            });
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({
                message:'something went wrong, please try again. ',
            });
        });
    }
    function deleteCivil(req,res){
        let civilId =req.params.civilId;  

        Civil.findByIdAndRemove(civilId).then((civil)=>{
            if(!civil){
                return res.status(400).json({
                    message:'There is no civil registred with given id in our database'
                });
            }
            // civil.countCivil -= 1;
            return res.status(200).json({
                message:'civil is  deleted successfully. ',
                data:civil
            });

        }).catch((err)=>{
            console.log(err);
            return res.status(400).json({
                message:'something went wrong, please try again.'
            });
        });

    }
    
   function search (req, res) {
        let params = req.query;
        let searchParams = {
            query: {},
            sort: { creationDate: -1 },
            skip: null,
            
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


        civil
            .find(searchParams.query)
            .count()
            .then((count) => {
                civil
                    .find(searchParams.query)
                    .sort(searchParams.sort)
                    .skip(searchParams.skip)
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


    function getAge(dateString) 
    {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age--;
        }
        return age;
    }
    function civilColection(req,res,next){
          Civil.count({gender:"Female"},function (err,civils){
            if(err) return next(err);
            res.json(civils)
        })
       
  

    }
  function allCivil (req, res, next) {
        Civil.aggregate([
            {
                $group: { 
                    _id: { region: '$region' }, 
                    countCivil: {
                        $sum: '$countCivil'
                        
                    }
                }
            },
            { $sort: {countCivil: -1} }
        ], function (err, civil) {
            if (err) return next(err);
            res.json(civil);
        });
      
    }
    function civilStatistics(){
         Civil.aggregate([
            {
              "$group": {
                "_id": {
                  "__alias_0": "$region"
                },
                "__alias_1": {
                  "$sum": 1
                }
              }
            },
            {
              "$project": {
                "_id": 0,
                "__alias_0": "$_id.__alias_0",
                "__alias_1": 1
              }
            },
            {
              "$project": {
                "y": "$__alias_1",
                "x": "$__alias_0",
                "_id": 0
              }
            },
            {
              "$addFields": {
                "__agg_sum": {
                  "$sum": [
                    "$y"
                  ]
                }
              }
            },
            {
              "$sort": {
                "__agg_sum": -1
              }
            },
            {
              "$project": {
                "__agg_sum": 0
              }
            },
            {
              "$limit": 5000
            }
          ])
    }
    






