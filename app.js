// process.on('warning', (warning) => {
//   console.log(warning.stack);
// });


if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
// console.log(process.env.SECREAT)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require ("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session =  require("express-session");
const flash = require("connect-flash")
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js")


const listingRouter = require("./routes/listing.js");
const reviewRouter  = require("./routes/review.js")
const userRouter  = require("./routes/user.js")



const sessionOptions = {
     secret : "mysupersecretstring",
     resave : false,
     saveUninitialized: true,
     cookie :{
      expires: Date.now()+ 7*24*60*60*1000,
      maxAge : 7*24*60*60*1000,
      httpOnly : true,
     }

}

// isko khi bhi likh sakte he 
app.use(session(sessionOptions));

// isko router ke midlleware ke upr hi likna he
app.use(flash());






// passport session ko use krta he isliye isko session ke middleware ke niche likhenge
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//locals ko store krne ke liye


app.use((req,res,next) =>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next()
})

// app.get("/demouser" , async(req,res) =>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld")
//   res.send(registeredUser)
// })






main()
  .then(() =>{
    console.log("connect to DB");
  })
  .catch((err) =>{
    console.log(err);
  });
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews" ,reviewRouter )
app.use("/" , userRouter)













// agr upr kisi bhi route se match na ho to ye kam krega
// app.all("*" , (req,res, next) =>{
//   next(new ExpressError(404,"Page Not Found"));
// })

  // Error handeling middleware


  // for try catch testing
  // app.use((err,req,res,next)=>{
  //   res.send("something went wrong")
  // })





















// it didnt match with any route then tthis will triggers ex- in case ofmethod override condition
// app.all('*' , (req,res,next) =>{
//   const err = new Error('page not found');
//   err.statusCode = 404;
//   next(err);
// })

// app.all("*" , (req,res,next) =>{
//   // res.status(404).render("error" , {message: "page not found !"});
//   next(new ExpressError(404 , "page not found !"));
// });

// app.all("(.*)" , (req,res,next) =>{
//   next(new ExpressError(404 , "page not found !"))
// })

   app.use( (req,res,next) =>{
  next(new ExpressError(404 , "page not found !"))
})

  app.use((err, req, res, next) =>{
    let {statusCode = 500, message ="wrong try"} = err;
    res.status(statusCode).render("error.ejs" , {message});
  })



  // app.use((req,res) =>{
  //   res.status(404).render("error.js" , {
  //     message: "page not found"
  //   })
  // })



app.listen(8000, ()=>{
    console.log("sever is listening to port 8000")
}) 