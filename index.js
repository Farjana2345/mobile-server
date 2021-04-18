const express = require('express')
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port =process.env.PORT || 5000
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yn9k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const serviceCollection = client.db("mobile").collection("service");
  const adminCollection = client.db("mobile").collection("admin");
  const orderCollection = client.db("mobile").collection("order");
  const reviewCollection = client.db("mobile").collection("review");

  app.post("/addService",(req,res)=>{
      const service =req.body;
      serviceCollection.insertOne(service)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  });

  app.get('/services',(req, res)=>{
    serviceCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  });
  app.get('/service/:_id',(req, res)=>{
        const id = ObjectID(req.params._id);
      serviceCollection.find({_id:id})
      .toArray((err,items)=>{
        res.send(items)
      })
  });

  app.post("/addAdmin",(req,res)=>{
    const admin =req.body;
    adminCollection.insertOne(admin)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
});
app.post("/addOrder",(req,res)=>{
  const order =req.body;
  orderCollection.insertOne(order)
  .then(result=>{
      res.send(result.insertedCount>0)
  })
});
app.get('/order',(req, res)=>{
  const email = req.query.email;
  orderCollection.find({email:email})
  .toArray((error,documents)=>{
    res.send(documents);
  })
})

app.get('/allorder',(req, res)=>{
  orderCollection.find({})
  .toArray((err,items)=>{
    console.log(items);
    res.send(items)
  })
});
app.post("/addReview",(req,res)=>{
  const review =req.body;
  reviewCollection.insertOne(review)
  .then(result=>{
      res.send(result.insertedCount>0)
  })
});
app.get("/reviews",(req,res)=>{
  reviewCollection.find()
  .toArray((err,items)=>{
    res.send(items)
  })
})

app.delete('/deleteItem/:id',(req, res)=>{
  const id = ObjectID(req.params.id);
  serviceCollection.deleteOne({_id:id})
  .then(documents=>{
   res.send(documents.deletedCount>0)
  })
})
  

app.post('/loginAdminEmail', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
    .toArray((err, admin) => {
      res.send(admin.length > 0)
    })
})
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})