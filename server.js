//BASE SETUP
// call the packages we need
const express = require('express'); //call express
const app = express(); // define our app using express

const Bear = require('./app/models/bear');
const mongoose = require('mongoose');
//const uri = 'mongodb+srv://rootAdm:recoucou@cluster0-7z3xv.mongodb.net/test?retryWrites=true&w=majority';
const uri = 'mongodb://localhost/bears_db';
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }).
  then(() => console.log('Connected')).catch(err => {
    console.log(Error, err.message);
    });

const port = process.env.PORT || 5000;
// configuration app
app.use(express.urlencoded({extended: true}));
app.use(express.json());


const router = express.Router(); // get an instance of the express Router

router.get('/', (req, res) => {
  res.json({ message: 'Hooray! welcome to our api!' });
});
router.route('/bears')
  .get((req,res) => {
    Bear.find({}, (err, bears) => {
      if(err) console.error(err)
      res.json(bears)
    })
  })
  .post((req,res) => {
    const bear = new Bear(req.body)
    bear.save((err, bear) => {
      if (err) console.error(err)
      res.json({message: 'Bear created!', bear});
    });
  });
  router.route('/bear/:id')
    .get((req,res) =>{
      const id = req.params.id;
      Bear.findById(id, (err, bear) => {
        if(err) console.error(err)
        res.json(bear)
      })
    })
    .put((req,res) =>{
      const id = req.params.id;
      Bear.findById(id, (err, bear) => {
        if(err) console.error(err)
        Object.assign(bear, req.body).save((err, bear) => {
        // bear.name= req.body.name //update info
        // bear.save((err,bear)=>{
          if(err) console.error(err)
          res.json({message:'Bear updated!', bear})
        })
      })
    })
    .delete((req, res) => {
      Bear.findByIdAndDelete(req.params.id, (err, bear) => {
        if(err){
          return console.error(err)
        }
        res.json({message:"Bear sucessfully deleted",bear})
      })
    })

//middleware to use for all requests
router.use((req, res) => {
  console.log(` coucou 🐳 !!`);
});

//ROUTE FOR OUR API 
app.get('/', (req, res) => {
  res.json({message: 'recoucou !!!!!'})
})



// REGISTER OUR ROUTES
app.use('/api', router);

app.listen(port, () => {
  console.log(`[🐼 Server is running on port ${port}]`);
  
})