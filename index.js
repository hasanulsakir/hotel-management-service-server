const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y80ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('hotelManagementService');
        const servicesCollection = database.collection('service');
        const orderCollection = database.collection('order');

        // Get Api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // order get  api
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email
            console.log(email);
            const query = { email:email };
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        });
     
        app.get('/delete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id:id};
            const order = await orderCollection.findOne(query);
            console.log(query);
            res.send(order);
        });
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });
            

// Post API
        app.post('/services', async (req, res) => {
            
            const services = req.body;
            const result = await servicesCollection.insertOne(services)
            res.json(result);
        })
        app.post('/order', async (req, res) => {
            
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result);
        })
// update api
        app.put('/services/:id',async (req,res)=> {
            const id = req.params.id;
            const updateService = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateService.title,
                    description: updateService.description,
                    price: updateService.price,
                    img: updateService.img
                },
            };
             const service = await servicesCollection.updateOne(filter,updateDoc,option);
            res.json(service);
        })
// update api
        app.put('/order/:id',async (req,res)=> {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: id };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status
                },
            };
             const order = await orderCollection.updateOne(filter,updateDoc,option);
            res.json(order);
        })
        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.deleteOne(query);
            res.json(service);
        })
        // order delete api
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const order = await orderCollection.deleteOne(query);
            res.json(order);
        })
     
       
    } finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running my server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})