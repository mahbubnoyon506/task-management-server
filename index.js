const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkrh5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
      await client.connect();
      const taskCollection =client.db('TaskCollections').collection('tasks');
      const completedCollection =client.db('TaskCollections').collection('completetasks');

      app.get('/tasks', async(req, res) => {
        const query = {};
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      });

      app.post('/tasks', async(req, res) => {
        const query = req.body;
        const result = await taskCollection.insertOne(query);
        res.send(result)
      })

      app.get('/tasks/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await taskCollection.findOne(query)
        res.send(result)
      })

      app.put('/tasks/:id', async(req, res) => {
        const id = req.params.id;
        const data = req.body;
        const query = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: data.name,
              deadline: data.deadline,
              description: data.description
            },
          };
        const result = await taskCollection.updateOne(query, updateDoc, options);
        res.send(result);
      })

     app.delete('/task/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await taskCollection.deleteOne(query)
        res.send(result)
     })

    app.post('/completetasks', async(req, res) => {
        const query = req.body;
        const result = await completedCollection.insertOne(query) 
        res.send(result);
    })
    app.get('/completetasks', async(req, res) => {
        const result = await completedCollection.find().toArray()
        res.send(result)
    })
   }

   finally{

   }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Running')
});

app.listen(port, () => {
    console.log('Server is listening the port', port);
});