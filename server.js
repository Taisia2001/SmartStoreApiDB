const PORT=process.env.PORT||3012;
const DIR='/docs/';
var http=require('http');
var express= require('express');
var bodyParser=require('body-parser');
var storeController =require('./api/controllers/store');
var app=express();
var db=require('./api/db');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", '*');
    next();
});
var server=http.createServer(app);
app.use('/',express.static(__dirname+DIR));
app.get('/',function (req,res) {
    res.sendFile(__dirname+DIR);
})
app.get('/category/list',storeController.allCategories);
app.get('/product/list',storeController.allProducts);
app.get('/category/:id',storeController.categoryById);
app.get('/product/:id', storeController.productById);
app.get('/orders',storeController.allOrders);
app.post('/product/add',storeController.createProduct);
app.post('/category/add',storeController.createCategory);
app.post('/category_products/add',storeController.createCategoryProd);
app.post('/order/add',storeController.createOrder);
app.put('/product_to_category',storeController.updateCategory);
app.get('/product/list/category/:id',storeController.productsByCategory);

db.connect('mongodb://localhost:27017/storeapi',
    { useUnifiedTopology: true },function (err) {
        if(err){
            return console.log(err)
        }
        server.listen(PORT);
    });
