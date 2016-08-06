var express = require('express');

var Storage = function(user) {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(item) {
    for (var i=0; i<this.items.length; i++) {
        if (this.items[i].id == item) {
           this.items.splice(i, 1);
           return item;
        }
    }
    return false;
}

Storage.prototype.edit = function(number, name) {
    for (var i=0; i<this.items.length; i++) {
        if (this.items[i].id == number) {
            this.items[i].name = name;
           return name;
        }
    }
    return false;
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    var item = storage.delete(req.params.id);
    if (item == false) {
        return res.sendStatus(400);
    }
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    var item = storage.edit(req.params.id, req.body.name);
    if (item == false) {
        return res.sendStatus(400);
    }
    res.status(201).json(item);
});

app.listen(process.env.PORT || 8080);