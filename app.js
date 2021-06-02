const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
const mongoose = require('mongoose')
const Item = require('./models/items')
const mongodb = 'mongodb://ckmobile:ckmobile123@cluster0-shard-00-00.kbtur.mongodb.net:27017,cluster0-shard-00-01.kbtur.mongodb.net:27017,cluster0-shard-00-02.kbtur.mongodb.net:27017/item-database?ssl=true&replicaSet=atlas-e5jvv9-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>{
    console.log('connected')
    app.listen(3000)
}).catch((err)=>{
    console.log(err)
})

app.set('view engine', 'ejs')


app.post('/items',(req,res)=>{
    const item = Item(req.body)
    item.save().then(()=>{
        res.redirect('/')
    }).catch(err => console.log(err))
})
app.get('/items/:id', (req, res)=>{
   Item.findById(req.params.id).then((result)=>{
       res.render('item-detail', { item: result })
   })
})
app.get('/edit/:id', (req, res)=>{
    Item.findById(req.params.id).then((result)=>{
        console.log(result)
        res.json({ item: result })
    })
     console.log(req.params)
 })
app.delete('/items/:id', (req, res)=>{
    Item.findByIdAndDelete(req.params.id).then((result)=>{
        res.json({ redirect: '/get-items'})
    })
     console.log(req.params)
 })
 app.put('/items/:id', (req, res)=>{
    Item.findByIdAndUpdate(req.params.id, req.body).then((result)=>{
        res.json({ msg: "Updated Successfully"})
    })
 })
app.get('/create-item', (req, res)=>{ 
    const item = new Item({
        name: "book",
        price: 5000
    })
    item.save().then(result=>res.send(result))
})
app.get('/get-items', (req, res)=>{
    Item.find().then(result=>res.render('index', {items: result})).catch(err=>{
        console.log(err)
    })
})
app.get('/get-item', (req, res)=>{
  
    Item.findById("60b74e796eab1c5cccb9bb27").then(result=>res.send(result)).catch(err=>{
        console.log(err)
    })
})
app.get('/',(req,res)=>{
    res.redirect('/get-items')
})

app.get('/add-item',(req,res)=>{
    res.render('add-item')
})

app.use((req, res)=>{
    res.render('error')
})