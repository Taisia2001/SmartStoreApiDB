var Store=require('../models/store');
exports.allCategories = function (req,res) {
    Store.allCategories(function (err,docs) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
}
exports.allOrders = function (req,res) {
    Store.allOrders(function (err,docs) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
}
exports.allProducts = function (req,res) {
    Store.allProducts(function (err,docs) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
}
exports.categoryById = function (req,res) {
    Store.categoryById(req.params.id,function (err,doc) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })
    
}
exports.productById = function (req,res) {
    Store.productById(req.params.id,function (err,doc) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })

}
exports.productsByCategory =    function (req,res) {
    Store.productsIDByCategory(req.params.id, async function (err,doc) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        if(doc==null){var p =[];return res.send(p);}
    res.send(doc.products);
    });
}

exports.createProduct = function(req,res){
    var product={
        name: req.body.name,
        description:req.body.description,
        image_url:req.body.image_url,
        price:req.body.price,
        special_price: req.body.special_price

    };
    if(product.special_price==""){product.special_price=null;}

    Store.createProduct(product,function (err,result) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(product);
    })
}

exports.createCategory = function(req,res){
    var category={
        name: req.body.name,
        description:req.body.description
    };

Store.createCategory(category,function (err,result) {
    if(err){
        console.log(err);
        return res.sendStatus(500);
    }
    res.send(category);
})
}
exports.createCategoryProd = function(req,res){
    var category={
        category: req.body.category,
        products:req.body.products
    };
    Store.createCategoryProd(category,function (err,result) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(category);
    })
}


exports.createOrder = function(req,res){
    var order={
        token: req.body.token,
        name: req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        products:req.body.products
    };


    Store.createOrder(order,function (err,result) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(order);
    })
}
exports.updateCategory=function(req,res){
    console.log(req.body.category);
    Store.updateCategory(req.body.category, {$set: {products: req.body.products}},function (err,result) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }

        res.sendStatus(200);
    })
}
exports.delete = function(req,res){
    Store.delete(req.params.id,function (err,result) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
}




