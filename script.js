let cart = [];
let modalQt = 1;
let modalKey = 0;
const c = (element)=>{
     return document.querySelector(element);
};
const cs = (element)=>{
    return document.querySelectorAll(element);
};

pizzaJson.map((item, index) =>{
    
    let pizza_copia_estrutura = c('.models .pizza-item').cloneNode(true);
    pizza_copia_estrutura.querySelector('.pizza-item--img img').src = item.img
    pizza_copia_estrutura.querySelector('.pizza-item--name').innerHTML = item.name;
    pizza_copia_estrutura.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`
    pizza_copia_estrutura.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizza_copia_estrutura.setAttribute('data-key', index); 
    c(".pizza-area").append(pizza_copia_estrutura);
    pizza_copia_estrutura.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); 
        modalQt = 1;
        modalKey = key;

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name ;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img ; 
        c('.pizzaInfo--actualPrice').innerHTML =  `R$${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('.selected');
        cs('.pizzaInfo--size').forEach((size , indexsize)=>{
            if(indexsize == 2){
                size.classList.add('.selected');
            };
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[indexsize];
        }); 
        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0 ;
        c('.pizzaWindowArea').style.display = 'flex' ; 
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1 ;

        } , 200);

    });

});
//eventos do modal
function fechamodal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'; 
    } , 500);
}
cs('.pizzaInfo--cancelButton , .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', fechamodal);
});

c('.pizzaInfo--qtmenos').addEventListener('click' , ()=>{
    if(modalQt > 1 ){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    };
});
c('.pizzaInfo--qtmais').addEventListener('click' , ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((itemm,  itemmindenx)=>{
    itemm.addEventListener('click' , (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        itemm.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
    let indentifier = pizzaJson[modalKey].id + "@" + size ;
    let returnIndentifier_trueOrFalse = cart.findIndex((item)=>{
        return item.indentifier == indentifier;
    });

    console.log(returnIndentifier_trueOrFalse);

    if(returnIndentifier_trueOrFalse > -1 ){
        cart[returnIndentifier_trueOrFalse].qt += modalQt;
    }
    else{
        cart.push({
           indentifier , 
           id: pizzaJson[modalKey].id,
           size,
           qt: modalQt
    });
    }
    updateCart();
    fechamodal();

});

function updateCart(){
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = ' ' ;
        
        let subtotal = 0;
        let total = 0; 
        let desconto = 0; 

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id); 
            subtotal += pizzaItem.price * cart[i].qt; 
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaName = `${pizzaItem.name} (${pizzaItem.sizes[cart[i].size]})`;

            cartItem.querySelector('img').src = pizzaItem.img ;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName ;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click' , ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click' , ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);

            //adiciona a estrutura

            /* "encontre o item no qual o retorno da vez é igual dele seja igual o index referente
            ao looping "*/

            /*a variavel acima indentifica o index da pizza dentro do for, ou seja, como ela
            constantemente muda, é necessario indentificar ela dentro do loop para que seja possivel
            chamar em especifico a pizza q eu quero no momento, é diferente da ultima vez que foi
            feito isso para a construção inicial do site ja que as informções la estavam salvas direto
            no html*/
        }
        desconto = subtotal * 0.1 ; 
        total = subtotal - desconto ;

        c('.subtotal span:last-child').innerHTML = `R${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R${total.toFixed(2)}`;
        
    } else {
        c('aside').classList.remove('show');
    }
}
