const {transporter , generateToken} = require("../utils/nodemailer");
const User = require('../model/user');
const Admin = require('../model/admin');
const Blog = require('../model/blog');

module.exports.getHome = async (req, res) => {
    const latestBlog  = await Blog.find().populate('user').exec();
    res.render('home', {latestBlog});

    
}
module.exports.checkIsLoggedIn = (req, res, next) =>{
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}
module.exports.getLogin= (req, res) => {
    res.render("login");
} 

module.exports.postLogin= async (req, res) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });

    if (user) {
        if (user.password != password) {
            res.send("Invalid password!")
        } else {

            if (req.session.isLoggedInAdmin) {
                req.session.isLoggedInAdmin = false;
                req.session.admin = null;
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/addBlog');
        }
    } else {
        res.send("User not found")
    }
}

module.exports.getRegister =  (req, res) => {
    res.render("register");
}

module.exports.postRegister = async (req, res) => {

    const { username, email, password } = req.body;
    
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.send("Email is already registered!");
    }

    // Generate a verification token
    const token = generateToken();

    // Save the token and user information to the database
    const newUser = new User({ username, password, email, verification_token: token });
    await newUser.save();

    // Email options
    const mailOptions = {
        from: 'aditi2003goyal@gmail.com', // replace with your Gmail email
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: http://localhost:3334/verify?token=${token}`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending verification email.');
        }
        console.log('Email sent: ' + info.response);
        res.send("User successfully registered. Check your email for verification.");
    });

    //res.send("User successfully registered");

}

module.exports.getVerification =async (req, res) => {
    const token = req.query.token;

    // Find the user in the database based on the token
    const user = await User.findOne({ verification_token: token });

    if (user) {
        // Mark the user as verified
        user.is_verified = true;
        user.verification_token = undefined;        // Optional: Clear the verification token after successful verification
        await user.save();
        res.send('Email verified successfully! You can now log in.');
    } else {
        res.send('Invalid verification token.');
    }
}

module.exports.checkIsLoggedInAdmin=(req, res, next)=> {
    if (req.session.isLoggedInAdmin) {
        next();
    } else {
        res.render('adminLogin');
    }
}

module.exports.getAdmin = async (req, res) => {

    const latestBlog = await Blog.find().populate('user').exec();
    console.log(latestBlog);
    res.render('admin', { latestBlog});
}

module.exports.postAdmin = async (req, res) => {
    const { username, password } = req.body;
    let admin = await Admin.findOne({ username: username });

    if (admin) {
        if (admin.password != password) {
            res.send("Invalid password!")
        } else {

            if (req.session.isLoggedIn) {
                req.session.isLoggedIn = false;
                req.session.user = null;
            }
            req.session.isLoggedInAdmin = true;
            req.session.admin = admin;
            res.redirect('/admin');
        }
    } else {
        res.send("Not an admin!")
    }
}

module.exports.getApproveBlog = async (req, res) => {
    const { blogId } = req.params;
    try {
        const blog = await Blog.findByIdAndUpdate(blogId, { $set: { approved: true } }, { new: true });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports.getRejectBlog = async (req, res) => {
    const { blogId } = req.params;
    // Add logic to handle blog rejection
    try {
        const blog = await Blog.findByIdAndDelete(blogId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log("Blog Rejected with ID: "+blogId);
}

module.exports.checkAdminForBlog= (req, res, next)=>{
    if (req.session.isLoggedInAdmin) {
        next();
    } else if(req.session.isLoggedIn) {
        next();
    }

    else{
        res.render('login');
    }
}

module.exports.getAddBlog = (req, res) => {
    res.render("addBlog");
}

module.exports.postAddBlog = async (req, res) => {

    if( req.session.user && req.session.user._id){
        let { title, desc } = req.body;
        let {path} = req.file;
        let newBlog = new Blog({ imageURL:path, title, desc, user: req.session.user._id, approved : false});
        await newBlog.save();

        const user = await User.findById(req.session.user._id);
        user.blog.push(newBlog._id);
        await user.save();

        res.redirect('/');
    }else if(req.session.admin ){
        const adminUser = await User.findOne({ email: "Aditi2003goyal@gmail.com" });
        if (!adminUser) {
            return res.send("Admin user not found.");
        }

        let { title, desc } = req.body;
        let {path} = req.file;
        let newBlog = new Blog({ imageURL:path, title, desc, user: adminUser._id, approved: true });
        await newBlog.save();

        adminUser.blog.push(newBlog._id);
        await adminUser.save();

        console.log(newBlog);

        res.redirect('/');
    }

    else{

        res.render('login');
    }
    // if (req.session.user && req.session.user._id) {
        
    // } else {
    //     res.send("User not authenticated");
    // }
}

module.exports.getMyBlogs = async (req, res)=>{

    if(req.session.admin ){

        const adminUser = await User.findOne({ email: "Aditi2003goyal@gmail.com" }).populate('blog');
        if (!adminUser) {
            return res.send("Admin user not found.");
        }

        //const user = await User.findById(req.session.user._id).populate('blog');
        res.render('myBlog', { blogs : adminUser.blog });
    }

    else if(req.session.user ) {

        const user = await User.findById(req.session.user._id).populate('blog').exec();
        console.log("USER");
        res.render('myBlog', { blogs : user.blog });
    }

    else{

        res.send("You are not logged In")
    }


    
}

module.exports.getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/');
        }
    });
}

module.exports.getReadMore =async (req , res)=>{

    const {blogID} = req.params;

    const blog = await Blog.findOne({_id:blogID}).populate('user');

    if(!blog){

        return res.status(404).send("Blog not found");
    }

    res.render('readMore' ,{blog});

}