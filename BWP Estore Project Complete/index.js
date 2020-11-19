const express = require('express');
const bodyparse = require('body-parser');
const app = express();
var ObjectId = require('mongodb').ObjectID;


const mongoclient = require('mongodb').MongoClient;
const url = "mongodb+srv://rahul:rahul@cluster0.f06su.mongodb.net/tet?retryWrites=true&w=majority";
const client = new mongoclient(url, { useNewUrlParser: true, useUnifiedTopology: true })


client.connect(err => {
    if (err) throw err;
})

app.use((req, res, next) => {
    // website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
    // set to true if you need the website to include cookies in the requests sent
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyparse.json());

app.post('/api/user', (req, res) => {
    var userin = req.body;
    console.log(userin)
    var userdb = client.db('bwp').collection('user');
    userdb.insertOne(userin, err => {
        if (err) throw err;
    })
    res.end();
})

app.get('/api/user/:uid', (req, res) => {
    var uin = req.params.uid;
    var userdb = client.db('bwp').collection('user');
    userdb.findOne({ "uid": uin }, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

})

app.put('/api/user/:uidin', (req, res) => {
    var userin = req.body;
    var userdb = client.db('bwp').collection('user');
    userdb.find({ _id: req.params.uidin }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result.length)
        if (result.length == 0) {
            userdb.insertOne(userin, err => {
                if (err) throw err;
            })
        } else {
            userdb.findOneAndUpdate({ _id: req.params.uidin }, { $set: req.body });
        }
    })

    res.end();
})


app.post('/api/product', (req, res) => {
    var userin = req.body;
    console.log(userin)
    var userdb = client.db('bwp').collection('product');
    userdb.insertOne(userin, err => {
        if (err) throw err;
    })

    res.end();
})

app.get('/api/product/:pid', (req, res) => {
    var uin = req.params.pid;
    uin = new ObjectId(uin)
    var userdb = client.db('bwp').collection('product');
    userdb.findOne({ "_id": uin }, (err, result) => {
        if (err) throw err
        res.send(result)
    });

})

app.put('/api/product/:pidin', (req, res) => {
    var userdb = client.db('bwp').collection('product');
    userdb.findOneAndUpdate({ "pid": req.params.pidin }, { $set: req.body });
    res.end();
})

app.delete('/api/product/:pid', (req, res) => {
    var uin = req.params.pid;
    uin = new ObjectId(uin)
    var userdb = client.db('bwp').collection('product');
    userdb.deleteOne({ "_id": uin }, (err, result) => {
        if (err) throw err
        res.send('deleted')
    });
})


//all filteration

app.get('/api/product', (req, res) => {
    var products = client.db('bwp').collection('product');
    products.find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/api/product/cat/:cat', (req, res) => {
    var cat = req.params.cat;
    var filterpro = [];
    var products = client.db('bwp').collection('product');
    products.find({ "category": cat }).toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        /**result.forEach(element => {
            console.log(element);
            for (var i = 0; i < element.cat.length; i++) {
                if (element.cat[i] == cat) {
                    filterpro.push(element);
                    break;
                }
            }
        });**/
        res.send(result)

    })
})

//price filteration
//1=<500
//2=<2000
//3=<5000
//4=<10000
//5=>10000
app.get('/api/product/price/:id', (req, res) => {
    var id = req.params.id;
    var p;
    if (id == 1) {
        p = 500;
    } else if (id == 2) {
        p = 2000;
    } else if (id == 3) {
        p = 5000;
    } else if (id == 4) {
        p = 10000
    } else {
        p = 10000000000;
    }

    var products = client.db('bwp').collection('product');
    products.find({}).toArray((err, result) => {
        if (err) throw err;

        var filter = [];
        console.log(p)
        result.forEach(element => {
            console.log(parseInt(element.price))

            if (parseInt(element.price) <= p) {
                filter.push(element);
            }
        });

        res.send(filter);
    })
})


app.get('/api/product/owner/:uid', (req, res) => {
    var uid = req.params.uid;
    var products = client.db('bwp').collection('product');
    products.find({ "owner": uid }).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})


app.get('/api/product/search/:s', (req, res) => {
    var s = req.params.s;
    var final = [];
    var products = client.db('bwp').collection('product');
    s = s.replace(/\s\s+/g, ' ');
    console.log(s)
    var arr = s.split(' ')

    products.find({}).toArray((err, result) => {
        if (err) throw err;
        //console.log(result.length)
        for (var j = 0; j < result.length; j++) {
            var string = result[j].title;
            string = string.toLowerCase();
            //console.log(string)
            for (var k = 0; k < arr.length; k++) {
                var string1 = arr[k].toLowerCase();
                console.log(string.search(string1))

                if (string.search(string1) >= 0) {
                    console.log(result[j])
                    final.push(result[j])
                    break;
                }
            }
        }
        res.send(final);
    })


})


app.post('/api/emails', (req, res) => {
    var email = req.body;
    console.log(email)
    var emaildb = client.db('bwp').collection('email');
    emaildb.insertOne(email, err => {
        if (err) throw err;
    })

    res.end();
})

app.get('/api/emails', (req, res) => {
    var emaildb = client.db('bwp').collection('email');
    emaildb.find({}).toArray((err, result) => {
        if (err) throw err;
        var emails = []
        for (var i = 0; i < result.length; i++) {
            emails.push(result[i].email);
        }
        console.log(emails);
        res.send(result)
    })
})


app.listen(1234, () => {
    console.log('server is listening');
})