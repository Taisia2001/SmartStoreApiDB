var cart={};
var dataP=[];
var dataC=[];
var cartGoods=0;
$('document').ready(async function (){
    var requestURL ='http://localhost:3012/product/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
   request.onload = function() {
        dataP=request.response;
        $('.bFoot').html('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="addNewCategory()">Create</button>');
        $('.prodC').html('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="addNewProduct()">Create</button>');
    }
        var requestURL2 ='http://localhost:3012/category/list';
        var request2 = new XMLHttpRequest();
        request2.open('GET', requestURL2);
        request2.responseType = 'json';
        request2.send();
        request2.onload = function() {
            dataC=request2.response;
        }
    initNav();
    loadGoods('http://localhost:3012/product/list','All Products');





});

function initNav(){
    var requestURL = 'http://localhost:3012/category/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var menu = request.response;
        var out="<a onclick='changeGoods(this)' data-art='1' class=\"categories standard_el\">All</a>";
        menu.forEach(function (item) {
            out+="<a onclick='changeGoods(this)' data-art='"+item._id+"' class=\"categories standard_el\">";
            out+=item.name;
            out+="</a>";
        });
        $('#navigation').html(out);
        out ="<a onclick='productModal()' data-toggle=\"modal\" data-target=\"#productAddModal\" class=\"categories standard_el\">Add Product</a>";
        out+="<a onclick='categoryModal()' data-toggle=\"modal\" data-target=\"#categoryModal\" class=\"categories standard_el\">Add Category</a>";
        out+="<a onclick='orders()' class=\"categories standard_el\">Orders</a>";

        $('#admin_features').html(out);

    }

}
function orders() {
    var requestURL = 'http://localhost:3012/orders';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
   /* let heading = document.createElement('h2')
    heading.innerText = "Orders"
    let out = document.createElement('div')*/
    var out='<h2 class="content_header">Orders</h2><div>';
    request.onload = function() {
        var products=request.response;
        products.forEach(function (item) {
           /* let name = document.createElement('div')
            name.innerText = item.name;*/
            out+='<div>'+item.name+'</div><br>';
            out+='<div>'+item.phone+'</div><br>';
            out+='<div>'+item.email+'</div><br>';
            var total=0;
            for(var i in item.products){
                    var pr =getElementById(i);
                    var price=0;
                    if (pr.special_price == null){
                        price=pr.price;
                    }else{
                        price=pr.special_price;
                    }
                    var full_priece=Number(item.products[i])*price;
                    total+=full_priece;
                    out+='<div>'+pr.name+" - "+item.products[i]+" units "+full_priece+"₴"+'</div><br>';
            }
            out+='<div>'+"Total: "+total+'₴</div><hr>';


        });
        out+='</div>';
        $('.container').html(out);
    }}
async function addNewCategory() {
    var errors="";
    if(document.getElementById('nameC').value=="")errors+="Wrong name \n";
    if(document.getElementById('descriptionC').value=="")errors+="Wrong description \n";
    if(errors!=""){
        alert(errors);
        return;}
    var categoryId;
    var prod = [];
    await $.post('http://localhost:3012/category/add', {
        name: document.getElementById('nameC').value,
        description: document.getElementById('descriptionC').value,
        async: false,

    },
    function (data, textStatus, jqXHR) {
        if (data.status=="error"){
            var errors="";
            for(var er in data.errors){
                errors+=data.errors[er]+"\n";
            }
            alert(errors);
        }else{
            categoryId=data._id;
            document.getElementById('nameC').value="";
            document.getElementById('descriptionC').value="";
            if(!alert('Category was created successfully')){window.location.reload();}

        }
    });
    var i=0;
    dataP.forEach(function (item) {
        if(document.getElementById(item._id).checked){
            prod[i]=item._id;
            ++i;
        }
    });
    $.post('http://localhost:3012/category_products/add', {
            category: categoryId,
            products:prod,
            async: false,
        },
        function (data, textStatus, jqXHR) {
            if (data.status=="error"){
                var errors="";
                for(var er in data.errors){
                    errors+=data.errors[er]+"\n";}
                alert(errors);
            }

        });
}
function addNewProduct() {
    var errors="";
    var reg = new RegExp('^(\\d+\\.)?\\d+$');
    if(document.getElementById('nameP').value=="")errors+="Wrong name \n";
    if(document.getElementById('descriptionP').value=="")errors+="Wrong description \n";
    if(document.getElementById('image_urlP').value=="")errors+="Wrong image URL \n";
    if(!reg.test(document.getElementById('priceP').value))errors+="Wrong price, there can be only nnn.nnn \n";
    if(document.getElementById('special_priceP').value.length==0) {
    }else if(!reg.test(document.getElementById('special_priceP').value))errors+="Wrong special price, there can be only nnn.nnn \n";
    if(errors!=""){
    alert(errors);
    return;}
    $.post('http://localhost:3012/product/add', {
        name: document.getElementById('nameP').value,
        description: document.getElementById('descriptionP').value,
        async: false,
        image_url: document.getElementById('image_urlP').value,
        price: document.getElementById('priceP').value,
        special_price: document.getElementById('special_priceP').value,

    },
    async function (data, textStatus, jqXHR) {
        if (data.status=="error"){
            var errors="";
            for(var er in data.errors){
                errors+=data.errors[er]+"\n";}
            alert(errors);
        }else{
            var prodId=data._id;
            var i=0;
            var p=[];
            var changes;
            await dataC.forEach(function (item) {
                if(document.getElementById(item._id).checked){
                    var getT="http://localhost:3012/product/list/category/"+item._id;
                    $.get( getT, function( data ) {
                        p=data;
                        p.push(prodId);
                        changes={"category":item._id,"products":p};
                    }).done(function () {
                       $.ajax({
                           url: 'http://localhost:3012/product_to_category',
                           type: 'PUT',
                           data:changes
                       });
                   })

                }
            });

            document.getElementById('nameP').value="";
            document.getElementById('descriptionP').value="";
            document.getElementById('image_urlP').value="";
            document.getElementById('priceP').value="";
            document.getElementById('special_priceP').value="";
            if(!alert('Product was successfully created')){window.location.reload();}

        }

    });
}
function productModal() {
    var requestURL = 'http://localhost:3012/category/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var categories = request.response;
        var out="";
        categories.forEach(function (item) {
            out+='<input type="checkbox" id="'+item._id+'" value="a4">'+item.name+'<br> ';
        });
        $('#categories').html(out);


    }
}
function categoryModal(){
    var requestURL = 'http://localhost:3012/product/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var products = request.response;
        var out="";
        products.forEach(function (item) {
            out+='<input type="checkbox" id="'+item._id+'" value="a4">'+item.name+'<br> ';
        });
        $('#products').html(out);


    }
}
function changeGoods(item) {
    if($(item).attr('data-art')==1){loadGoods('http://localhost:3012/product/list',item.innerHTML+' Products');
    }else{
        loadGoodsC('http://localhost:3012/product/list/category/'+$(item).attr('data-art'),item.innerHTML)
    }
}
function loadGoodsC(url,header){
    var requestURL = url;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    var out='<h2 class="content_header">'+header+'</h2><div class="row ">';
    request.onload = function() {
        var productsID=request.response;
        var item;
        productsID.forEach(function (it) {
            item=getElementById(it);
            out+='<div class="books col-lg-3"> <img src="'+item.image_url+'" data-toggle="modal" data-target="#productModal" onclick="prodModal(this)"  alt="img" data-art="'+item._id+'"><br>';
            if(item.special_price!=null){out+='<span class="price last_price">'+item.price+'₴</span>'
                out+='<span class="price">'+item.special_price+'₴</span><br>';
            }else{out+='<span class="price">'+item.price+'₴</span><br>';}
            out+='<a onclick="prodModal(this)" data-toggle="modal" data-target="#productModal" data-art="'+item._id+'">'+item.name+'</a> </div>';
        });
        out+='</div>';
        $('.container').html(out);
    }
}
function loadGoods(url,header){
    var requestURL = url;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    var out='<h2 class="content_header">'+header+'</h2><div class="row ">';
    request.onload = function() {
        var products=request.response;
        products.forEach(function (item) {
            out+='<div class="books col-lg-3"> <img src="'+item.image_url+'" data-toggle="modal" data-target="#productModal" onclick="prodModal(this)"  alt="img" data-art="'+item._id+'"><br>';
            if(item.special_price!=null){out+='<span class="price last_price">'+item.price+'₴</span>'
                out+='<span class="price">'+item.special_price+'₴</span><br>';
            }else{out+='<span class="price">'+item.price+'₴</span><br>';}
            out+='<a onclick="prodModal(this)" data-toggle="modal" data-target="#productModal" data-art="'+item._id+'">'+item.name+'</a> </div>';


        });
        out+='</div>';
        $('.container').html(out);
    }

}
function prodModal(item) {
    var el = getElementById(($(item).attr('data-art')));
    $('.product-title').html(el.name);
    var inner = ' <img src="' + el.image_url + '" alt="img" data-art="' + item._id + '"><br>';
    inner+='<br><h4>' + el.name + '</h4>';
    if (el.special_price != null) {
        inner += '<span class="price last_price">' + el.price + '₴ </span>'
        inner += '<span class="price"> ' + el.special_price + '₴</span><br>';
    } else {
        inner += '<span class="price">  ' + el.price + '₴</span><br>';
    }
    inner += '<br><p class="description">' + el.description + '</p>';
    $('#product-content').html(inner);
    inner='<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#cartModal" onclick="addToCart(this)" data-art="'+el._id+'" >Buy</button>'
    $('.prod').html(inner);
}

function getElementById(id) {
    for(var k in dataP){
        if(dataP[k]._id==id)return dataP[k];
    }
}
function getCategoryById(id) {
    for(var k in dataC){
        if(dataC[k]._id==id)return dataC[k];
    }
}



function contains(id, productsID) {
    for(var i in productsID){
        if(productsID[i]==id)return true;
    }
    return false;
}