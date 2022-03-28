const express = require('express');
const router = express.Router();


const dashboardController = require('../controllers/dashboard.controller');
const {ensureAuthenticated} = require("../config/auth.js");
const {upload} = require("../middleware/upload.js");





router.get('/', ensureAuthenticated, dashboardController.homePage);
router.get('/success', ensureAuthenticated, dashboardController.successPage);
router.get('/settings', ensureAuthenticated, dashboardController.settingsPage);
//router.get('/home/posts', ensureAuthenticated, dashboardController.getAllPosts);
//router.get('/home/posts/:id', ensureAuthenticated, dashboardController.getOnePost);
router.post('/posts', upload.fields([{ name: 'docs'}, { name: 'audioFiles'}]), ensureAuthenticated, dashboardController.newPost);
//router.put('/home/posts/:id', ensureAuthenticated, dashboardController.updatePost);
//router.delete('/home/posts/:id', ensureAuthenticated, dashboardController.deleteOnePost);
//router.delete('/home/posts', ensureAuthenticated, dashboardController.deleteAllPosts);
//router.get('/home/posts?title=[kw]', ensureAuthenticated, dashboardController.getPostByKw);

module.exports = router;


//GET	api/tutorials	get all Tutorials
//GET	api/tutorials/:id	get Tutorial by id
//POST	api/tutorials	add new Tutorial
//PUT	api/tutorials/:id	update Tutorial by id
//DELETE	api/tutorials/:id	remove Tutorial by id
//DELETE	api/tutorials	remove all Tutorials
//GET	api/tutorials/published	find all published Tutorials
//GET	api/tutorials?title=[kw]	find all Tutorials which title contains 'kw'
