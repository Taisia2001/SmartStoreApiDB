var db = require('../db');
var ObjectID = require('mongodb').ObjectID;
exports.allCategories=function (cb) {
    db.get().collection('categories').find().toArray(function (err,docs) {
        cb(err,docs);
    })
}

exports.allOrders=function (cb) {
    db.get().collection('orders').find().toArray(function (err,docs) {
        cb(err,docs);
    })
}
exports.allProducts=function (cb) {
    db.get().collection('products').find().toArray(function (err,docs) {
        cb(err,docs);
    })
}
exports.categoryById=function (id,cb) {
    db.get().collection('categories').findOne({_id: ObjectID(id)},function (err,doc) {
        cb(err,doc);
})}
exports.productById=function (id,cb) {
    db.get().collection('products').findOne({_id: ObjectID(id)},function (err,doc) {
        cb(err,doc);
    })}
exports.productsIDByCategory=function (id,cb) {
    db.get().collection('categ_to_products').findOne({category: id},function (err,doc) {
        cb(err,doc);
    })}

exports.createCategory = function (category,cb) {
    db.get().collection('categories').insert(category,function (err,result) {
       cb(err,result);
    });
}
exports.createCategoryProd = function (category,cb) {
    db.get().collection('categ_to_products').insert(category,function (err,result) {
        cb(err,result);
    });
}
exports.createProduct = function (product,cb) {
    db.get().collection('products').insert(product,function (err,result) {
        cb(err,result);
    });
}
exports.createOrder = function (order,cb) {
    db.get().collection('orders').insert(order,function (err,result) {
        cb(err,result);
    });
}

exports.updateCategory=function (id,newData,cb) {
    db.get().collection('categ_to_products').updateOne(
    {category:id}, newData, function (err,result) {
        cb(err,result);
    }
)}
exports.delete=function (id,cb) {
    db.get().collection('artists').deleteOne(
        {_id: ObjectID(id)},
        function (err,result) {
            cb(err,result);
        }
    )
}

