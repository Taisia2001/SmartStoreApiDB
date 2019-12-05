var cart={};
var data;
var cartGoods=0;
$('document').ready(function (){
    var requestURL ='/product/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        data=request.response;
        checkCart();
        changeCart(0);
        $('.bFoot').html('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="createPost()">Create</button>');
    }
    initNav();
    loadGoods('/product/list','All Products');
});
function changeGoods(item) {
    if($(item).attr('data-art')==1){loadGoods('/product/list',item.innerHTML+' Products');
    }else{
        loadGoodsC('/product/list/category/'+$(item).attr('data-art'),item.innerHTML)
    }
}
function createPost() {
    if (cartGoods==0){
        alert('Error, your cart is empty');
    }else{
        var errors="";
        var regPhone = new RegExp('^(\\+)?\\d+$');
        var email=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(document.getElementById('name').value=="")errors+="Wrong name \n";
        if(!regPhone.test(document.getElementById('phone').value))errors+="Wrong phone \n";
        if(!email.test(String(document.getElementById('email').value).toLowerCase()))errors+="Wrong e-mail \n";

        if(errors!=""){
            alert(errors);
            return;}
        $.post('/order/add', {
                token: 'x8H_i721iqlF4YP2BTAU',
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                async: false,
                email: document.getElementById('email').value,
                products:cart,

            },
            function (data, textStatus, jqXHR) {
                if (data.status=="error"){
                    var errors="";
                    for(var er in data.errors){
                        errors+=data.errors[er]+"\n";
                    }
                    alert(errors);
                }else{
                    document.getElementById('name').value="";
                    document.getElementById('phone').value="";
                    document.getElementById('email').value="";
                    cart={};
                    cartGoods=0;
                    localStorage.setItem('cart', JSON.stringify(cart) );
                    if(!alert('Order successfully accepted')){window.location.reload();}

                }

            });
    }}
function initNav(){
    var requestURL = '/category/list';
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
        out ="<a data-toggle=\"modal\" data-target=\"#productAddModal\" class=\"categories standard_el\">Add Product</a>";
        out+="<a data-toggle=\"modal\" data-target=\"#categoryModal\" class=\"categories standard_el\">Add Category</a>";
        out+="<a onclick='orders()' class=\"categories standard_el\">Orders</a>";

        $('#admin_features').html(out);

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
        Object.values(productsID).forEach(function (it) {
            item=getElementById(it);
            out += '<div class="books col-lg-3"> <img src="' + item.image_url + '" data-toggle="modal" data-target="#productModal" onclick="prodModal(this)"  alt="img" data-art="' + item._id + '"><br>';
            if (item.special_price != null) {
                out += '<span class="price last_price">' + item.price + '₴</span>'
                out += '<span class="price">' + item.special_price + '₴</span><br>';
            } else {
                out += '<span class="price">' + item.price + '₴</span><br>';
            }
            out += '<a onclick="prodModal(this)" data-toggle="modal" data-target="#productModal" data-art="' + item._id + '">' + item.name + '</a> <br><button class="buy_button" onclick="addToCart(this)" data-art="' + item._id + '" data-toggle="modal" data-target="#cartModal" >Buy</button></div>';
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
            out+='<a onclick="prodModal(this)" data-toggle="modal" data-target="#productModal" data-art="'+item._id+'">'+item.name+'</a> <br><button class="buy_button" onclick="addToCart(this)" data-art="'+item._id+'" data-toggle="modal" data-target="#cartModal" >Buy</button></div>';


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
function addToCart(item) {
    if(cart[$(item).attr('data-art')]!=undefined){
        cart[$(item).attr('data-art')]++;}else{
        cart[$(item).attr('data-art')]=1;
    }
    changeCart(1);
}
function changeCart( num){
    var out='';
    var total=0;
    var totalS='';
    cartGoods=cartGoods+num;
    if(cartGoods==0){ out='<span class="empty">Your cart is empty</span>';}
    else{
        var el;
        for(var w in cart){
            el=getElementById(w);
            out+='<div class="book">';
            out+='<button class="delete" data-art="'+w+'">x</button>';
            out+='<img src="'+el.image_url+'"><br>';
            out+='<span class="name">'+el.name+'</span>';
            if(el.special_price==null){
                out+='<span class="priceC"> '+el.price+'₴</span><br>';
            }else {
                out+='<span class="priceC"> '+el.special_price+'₴</span><br>';
            }
            out+='<span class="change"><button class="minus_button" data-art="'+w+'"+>-</button>';
            out+='<span class="num">'+cart[w]+'</span>';
            out+='<button class="plus_button" data-art="'+w+'"+>+</button>';
            if(el.special_price==null){
                out+='<span class="total">'+(el.price*cart[w])+'₴</span></span>';
                total+=el.price*cart[w];
            }else{
                out+='<span class="total">'+(el.special_price*cart[w])+'₴</span></span>';
                total+=el.special_price*cart[w];
            }
            out+='</div><br>';
        }
        totalS='Total: '+total+'₴';
    }
    var buttons='<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    if(cartGoods!=0){ buttons+='<button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#buyModal">Buy</button>'}
    $('#cart_number').html(cartGoods);
    $('#cart_total').html(totalS);
    $('#cart-content').html(out);
    $('#cart-footer').html(buttons);
    $('button.delete').on('click',deleteFromCart);
    $('button.plus_button').on('click',plusBooks);
    $('button.minus_button').on('click',minusBooks);
    localStorage.setItem('cart', JSON.stringify(cart) );
}
function getElementById(id) {
    for(var k in data){
        if(data[k]._id==id)return data[k];
    }
}
function plusBooks() {
    var articul=$(this).attr('data-art');
    cart[articul]++;
    changeCart(1);
}
function minusBooks() {
    var articul=$(this).attr('data-art');
    if(cart[articul]>1){
        cart[articul]--;
        changeCart(-1);}
}
function deleteFromCart() {
    var articul=$(this).attr('data-art');
    cartGoods=cartGoods-1*cart[articul];
    delete cart[articul];
    changeCart(0);

}
function checkCart() {
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
        for (var i in cart) cartGoods += cart[i];
    }
}
function contains(id, productsID) {
    for(var i in productsID){
        if(productsID[i]==id)return true;
    }
    return false;

}