//var $ = require("jquery");

const Post = require("../models/posts.model.js");
const path = require('path');


//GET home page
const homePage = (req, res) => {     
    console.log(req.user.name);
    res.render('dashboard', { 
        user: req.user
    }); 
};

////GET '/home/posts'
//const getAllPosts = (req, res, next) => {
//    res.json({message: "GET all posts"});
//};
//
////GET '/home/posts/:id'
//const getOnePost = (req, res, next) => {
//    res.json({message: "GET 1 post"});
//};
//
////GET '/home/posts?title=[kw]'
//const getOnePost = (req, res, next) => {
//    res.json({message: "GET 1 post"});
//};
//



//app.post('/cool-profile', cpUpload, function (req, res, next) {
//  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//  //
//  // e.g.
//  //  req.files['avatar'][0] -> File
//  //  req.files['gallery'] -> Array
//  //
//  // req.body will contain the text fields, if there were any
//})





//POST '/home/posts'
const newPost = (req, res, next) => {
    
    
    try{
        
        
//        console.log(req.body);
        
//        console.log(req.files['docs'].id);
//        console.log(req.files[''])

       
        
        
        Post.findOne({userName: req.user.name, postId: req.body.id}).then((post) => {
            
            
        if(post){
                                                                   
                console.log(post);
                                                                   
                  return res.status(200).json({
                    success: false,
                    message: `Post already exists`
                                                                  
                 });                                                 
                                                                   
                                                                   
                                                                  
             }
            
            else{
                
//                console.log(req.files['docs'].length);
//                console.log(req.files['audioFiles'].length);
                
                let docIds = [];
                let audioIds = [];
                
                for(var i=0; i < req.files['docs'].length; i++){
                    docIds.push(req.files['docs'][i].id)
                    
                }
                
                for(var j=0; j < req.files['audioFiles'].length ; j++){
                    audioIds.push(req.files['audioFiles'][j].id)
                }
                
                
                console.log(docIds);
                console.log(audioIds);
                
                
//                for(var i=0;i<req.files['docs'].length;i++){
//                    
//                    req.files['docs'][i]
//                }
//                
//                for(var j=0;j<req.files['audioFiles'].length;j++){
//                    
//                    req.files['audioFiles'][j]
//                }
                
                
                let newPost = new Post({
                        note: req.body.note,
                        userName: req.user.name,
                        postId: req.body.id,
                        audioIds: audioIds,
                        docIds: docIds,
                    });
    
            newPost.save()
                        .then((post) => {

                            return res.status(200).json({
                                success: true,
                                message: `Hurray ... Your Post was successful..: ${post}`,
                            });
                        })
                        .catch((err) => res.status(500).json({
                            success: false, 
                            message: `Sorry .. Your Post failed to make it Successfully &#128532;`
                        }));
                
                
            }
    
    
        
            
            
        }).catch((err) => {
                  
                  return res.status(500).json({
                            success: false, 
                            message: `Sorry .. Your Post failed to make it Successfully &#128532;`
                  })
                  
                 
        });
        



    }catch(err){

        res.status(500).json({
            success: false, 
            message: `Sorry .. Your Post failed to make it Successfully &#128532;`
        });
        
        next(err);

    }
    
    
    


};


//GET success page
const successPage = (req, res) => {     
    console.log(req.user.name);
    res.render('success', { 
        user: req.user
    }); 
};

//GET settings page
const settingsPage = (req, res) => {     
    console.log(req.user.name);
    res.render('settings', { 
        user: req.user
    }); 
};



//
////PUT '/home/posts/:id'
//const updatePost = (req, res, next) => {
//    res.json({message: "PUT 1 post"});
//};
//
////DELETE 'home/posts/:id'
//const deleteOnePost = (req, res, next) => {
//    res.json({message: "DELETE 1 post"});
//};
//
////DELETE '/posts'
//const deleteAllPosts = (req, res, next) => {
//    res.json({message: "DELETE all posts"});
//};





//router.get('/home', ensureAuthenticated, dashboardController.homePage);
//router.get('/home/posts', ensureAuthenticated, dashboardController.getAllPosts);
//router.get('/home/posts/:id', ensureAuthenticated, dashboardController.getOnePost);
//router.post('/home/posts', ensureAuthenticated, dashboardController.newPost);
//router.put('/home/posts/:id', ensureAuthenticated, dashboardController.updatePost);
//router.delete('/home/posts/:id', ensureAuthenticated, dashboardController.deleteOnePost);
//router.delete('/home/posts', ensureAuthenticated, dashboardController.deleteAllPosts);
//router.get('/home/posts?title=[kw]', ensureAuthenticated, dashboardController.getPostByKw);

module.exports = {
    homePage,
    newPost,
    successPage,
    settingsPage
}