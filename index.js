const express = require('express'); 
const app = express();
const ejs = require('ejs');

app.use(express.static('./styles'));
app.use(express.static(__dirname + '/photos'));

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const multer = require('multer');
const { request } = require('express');
let imageIndex = 0;
let loadedFileName;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/photos");
    },
    filename: function (req, file, cb) {
        loadedFileName = `${String(imageIndex)}.jpg`;
        imageIndex++;
        cb(null, loadedFileName);
    }
})

const upload = multer({ storage: storage });

app.listen(8000, () =>  console.log('Server is running...'));

class Car {
    constructor(brand, model, carBody, year, engine, transmission, photoPath) {
        this.brand = brand;
        this.model = model;
        this.carBody = carBody;
        this.year = year;
        this.engine = engine;
        this.transmission = transmission;
        this.photoPath = photoPath;
    }
    
}

class CarsList {
    cars = [
        new Car("Mers", "s200", 'Cедан',new Date(2001, 1, 3, 19, 0, 0), "Бензин", "Aвтомат", ""),
        new Car("BMW", "m3", 'Cедан', new Date(2018, 1, 20, 19, 0, 0), "Дизель", "Aвтомат", "")
    ];

    selectedIndex = -1;

    getList() {
        return this.cars;
    }

    selectItem(index){
        if (this.cars[index])
        {
            this.selectedIndex = index;
        } else 
        {
            this.selectedIndex = -1;
        }
    }


    addItem(item){
        if (item instanceof Car){
            this.cars.push(item);
        }
    }

    deleteItem() {
        if (this.selectedIndex !== -1) {
            this.cars.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    }

    editItem(editedItem){
        if (this.selectedIndex !== -1) {
            this.cars[this.selectedIndex] = editedItem;
            this.selectedIndex = -1;
        }
    }
}

let carsList = new CarsList();

app.get('/main', function(req, res) {
    carsList.selectedIndex = -1
    ejs.renderFile(__dirname + '\\views\\main.ejs',
    {
        cars: carsList.cars
    },
    {},
    (err, template) => {
        res.send(template);
        
    })
});

app.get('/info', function(req, res) {
    console.log (Number(req.query.id))



    ejs.renderFile(__dirname + '\\views\\info.ejs',
    {
            
        car: carsList.cars[req.query.id]
    },
    {},
    (err, template) => {
        
        res.send(template);
            
    })
    carsList.selectItem(req.query.id)
    
});

app.get('/delete', function(req, res) {
    if (carsList.selectedIndex != -1){
        ejs.renderFile(__dirname + '\\views\\delete.ejs',
        {
            car: carsList.cars[carsList.selectedIndex]
        },
        {},
        (err, template) => {
            res.send(template);
        })
    }else{
        res.redirect(303, "/main");
    }
});

app.get('/edit', function(req, res) {
    if (carsList.selectedIndex != -1){
        ejs.renderFile(__dirname + '\\views\\edit.ejs',
        {
            car: carsList.cars[carsList.selectedIndex]
        },
        {},
        (err, template) => {
            res.send(template);
            
        })
    }else{
        res.redirect(303, "/main");
    }
});


app.get('/add', function (req, res) {
    ejs.renderFile(__dirname + '\\views\\add.ejs',
        {
            car: carsList.cars[req.params.id]
        },
        {},
        (err, template) => {
            res.send(template);
            
        })
});


app.post('/add', upload.single('file'), function (req, res) {
    if (!req.body) {
        console.log("bad request");
        return res.sendStatus(400);
    }

    let engine;
    if (req.body.engine === "gas") {
        engine = "Бензин";
    }  
    if (req.body.engine === "electro") {
        engine = "Электро";
    }  
    if (req.body.engine === "hybrid") {
        engine = "Гибрид";
    }
    if (req.body.engine === "diesel") {
        engine = "Дизель";
    }

    let car = new Car(
        req.body.brand, 
        req.body.model, 
        req.body.carBody, 
        new Date(req.body.year),
        engine,
        req.body.transmission,
        loadedFileName 
    )

    carsList.addItem(car);

    res.redirect(303, "/main");
});

app.post('/delete', urlencodedParser, function (req, res) {
    if (!req.body) {
        console.log("bad request");
        return res.sendStatus(400);
    }

    carsList.deleteItem();

    res.redirect(303, "/main");
})

app.post('/edit', upload.single('file'), function (req, res) {
    if (!req.body) {
        console.log("bad request");
        return res.sendStatus(400);
    }

    let engine;
    if (req.body.engine === "gas") {
        engine = "Бензин";
    }  
    if (req.body.engine === "electro") {
        engine = "Электро";
    }  
    if (req.body.engine === "hybrid") {
        engine = "Гибрид";
    }
    if (req.body.engine === "diesel") {
        engine = "Дизель";
    }

    carsList.editItem( 
        new Car(
            req.body.brand, 
            req.body.model, 
            req.body.carBody, 
            new Date(req.body.year),
            engine,
            req.body.transmission, 
            loadedFileName
        )
    );

    res.redirect(303, "/main");
})