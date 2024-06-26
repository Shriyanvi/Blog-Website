const express=require('express');
const router=express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
//app.use("/uploads" , express.static(path.join(__dirname , 'uploads')));


const {getHome , getLogin ,postLogin ,getRegister , postRegister, getVerification, getAdmin,postAdmin ,getApproveBlog ,getRejectBlog ,getAddBlog ,postAddBlog ,getMyBlogs,getLogout  , checkAdminForBlog , checkIsLoggedIn , checkIsLoggedInAdmin , getReadMore  } = require('../controller/blog');

router.get('/',getHome );
router.get('/login' , getLogin);
router.post('/login' , postLogin);
router.get('/register' , getRegister);
router.post('/register' , postRegister);
router.get('/verify', getVerification);
router.get('/admin' ,checkIsLoggedInAdmin ,getAdmin);
router.post('/admin' , postAdmin);
router.get('/approveBlog/:blogId' , getApproveBlog);
router.get('/rejectBlog/:blogId' , getRejectBlog);
router.get('/addBlog' ,checkAdminForBlog,  getAddBlog);
router.post('/addBlog' , upload.single('imageURL'), postAddBlog);
router.get('/myBlogs' , getMyBlogs);
router.get('/logout' , getLogout);
router.get('/readMore/:blogID' , getReadMore);


module.exports=router;
