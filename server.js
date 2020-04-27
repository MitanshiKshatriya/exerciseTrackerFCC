const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://mk_69:69mk69@cluster0-ju3qn.mongodb.net/excersiceDB",
                 { useNewUrlParser: true,useUnifiedTopology:true },function(err){
  if(err){
    console.log(err)
  }else{
    console.log("connected!")
  }
})

var UsersSchema= new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  exercises:[{
    duration: Number,
    description: String,
    date: String
  }]
})
/*var ExerciseSchema= new mongoose.Schema({
  userId: String,
    username:String,
    description: String,
    duration: Number,
    date: String
})
var Exercise=mongoose.model("Exercise",ExerciseSchema)*/
var User=mongoose.model("User",UsersSchema)


app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/exercise/new-user",function(req,res){
  var x;
  var user1=new User({
    username:req.body.username
  })
  user1.save(function(err){
    if(err){res.send("username already taken")}
    else{
      res.send(user1)
    }
  })
  
  
})
var l=[]
app.get("/api/exercise/users",function(req,res){
 
  User.find(function(err,users){
    if(err){
        console.log(err)
      res.send("error")
    }else{
        users.forEach(function(user){
         
            l.push(user)
          
        })
      
    }
   res.send(l)
})
})

app.post("/api/exercise/add",(req,res)=>{
  //res.send("A-OK")

  var date=new Date(Date.now()).toString().split(" ").slice(0, 4).join(" ")
  console.log("wtf is happening now")
  var newExercise={
    description:req.body.description,
    duration:Number(req.body.duration),
    //date:req.body.date.length!=0?new Date(req.body.date).toString().split(" ").slice(0, 4).join(" "):new Date().toString().split(" ").slice(0, 4).join(" ")
    date:req.body.date===undefined?new Date().toString().split(" ").slice(0, 4).join(" "):new Date(req.body.date).toString().split(" ").slice(0, 4).join(" ")
  }
  var username="";
  User.find({_id:req.body.userId},(err,doc)=>{
    if(err){console.log(err)
           res.send("no such id found!")
           }
    else{
     // username=doc.username
if(doc[0].exercises){
  doc[0].exercises.push(newExercise)
      doc[0].save(function(err){
        if(err){console.log("err while saving")}
               else{console.log("updates successfully saved")}
      })
}      
  
      
      console.log("found item:"+doc[0].username)}
     var x={
    username:doc[0].username,
    description:req.body.description,
    duration:Number(req.body.duration),
    _id:doc[0]._id,
    //date:req.body.date.length!=0?new Date(req.body.date).toString().split(" ").slice(0, 4).join(" "):new Date().toString().split(" ").slice(0, 4).join(" ")
       date:req.body.date===undefined?new Date().toString().split(" ").slice(0, 4).join(" "):new Date(req.body.date).toString().split(" ").slice(0, 4).join(" ")
          }
     res.send(x)
  })
  
})
app.get("/api/exercise/log",(req,res)=>{
  const {userId,from,to,limit}=req.query
  console.log("userId="+userId)
  //res.send("A-OK")
  //https://fuschia-custard.glitch.me/api/exercise/log?userId=rJpyC3bDL
  //https://polished-pancake.glitch.me/api/exercise/log?userId=5ea73b1a597687677fa92cd7
 User.find({_id:userId},(err,doc)=>{
    if(err){console.log(err)
           res.send("unknown userId")
           }
  else{
    var list=[]
    var listOfexercises=doc[0].exercises.forEach((exercise)=>{
     // list=[...list,{description:exercise.description,duration:+exercise.duration,date:exercise.date}]
      list.unshift({description:exercise.description,duration:+exercise.duration,date:exercise.date})
    })
    if(limit){
      list=list.slice(0,limit)
    }
    if(from){
      const fromDate=new Date(from)
      list=list.filter(exe=>new Date(exe.date)>fromDate)
    }
    if(to){
      const toDate=new Date(to)
      list=list.filter(exe=>new Date(exe.date)<toDate)
    }
    if(to && from){
      
    }
    res.json({
      _id:doc[0]._id,
      username:doc[0].username,
      count:doc[0].exercises.length,
      log:list
    })
  }
  })
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
