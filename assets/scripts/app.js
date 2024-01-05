class Product {
  
    constructor(title, img, desc, price) {
    this.title = title;
    this.img = img;
    this.desc = desc;
    this.price = price;
  }
}

class Attribute{
  constructor(atrName, atrValue){
    this.name = atrName;
    this.value = atrValue;
  }
}

class Component{
  constructor(renderHookId){
    this.renderHookId = renderHookId;
    this.render();
  }

  render() {};

  createRootElement(tag, cssClasses, attributes){
    const rootEl = document.createElement(tag);

    if(cssClasses){
      rootEl.className = cssClasses;
    }

    if(attributes && attributes.length > 0){
        attributes.forEach( atr => 
          rootEl.setAttribute(atr.name, atr.value)
        )
    }

    document.getElementById(this.renderHookId).append(rootEl);
    return rootEl;
  }
}

class ShoppingCart extends Component{

  items = []

  set newCart(value){
    this.items = value;
    this.totalAmountEl.innerHTML = ''
    this.totalAmountEl.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`
  }

  get totalAmount(){
    const sum = this.items.reduce(
      (prevValue, curProduct) => prevValue + curProduct.price,
       0
    );
    return sum;
  }

  constructor(renderHookId){
    super(renderHookId);
    this.activateOrderButton();
  }

  orderNow = () => {
    console.log('Ordering...')
    console.log(this.items);
  }

  render(){
    
      const cartEl = this.createRootElement('section', 'cart');
      cartEl.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order Now!</button>
      `
      this.totalAmountEl = cartEl.querySelector('h2');
      this.cartEl = cartEl;
  }

  activateOrderButton(){
      const orderBtn = this.cartEl.querySelector('button');
      orderBtn.addEventListener('click', this.orderNow)
    }
  

  addProduct(product){
    this.items.push(product);
    const updatedCart = [...this.items];
    this.newCart = updatedCart;
  }

}

class ProductItem extends Component{
  constructor(product, renderHookId) {
    super(renderHookId);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render(){
      
    if(this.product){
      const prodEl = this.createRootElement('li', 'product-item');
      prodEl.innerHTML = `
          <div>
              <img src="${this.product.img}">
              <div class="product-item__content">
                  <h2>${this.product.title}</h2>
                  <h3>${this.product.price}</h3>
                  <p>${this.product.desc}</p>
                  <button>Add to Cart</button>
              </div>
          </div>
      `;
        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));
        // return prodEl;
    }
      
  }
}

class ProductList extends Component{
    
  products = [];
    constructor(renderHookId){
      super(renderHookId);
      this.fetchProducts();
    }

    fetchProducts(){
      this.products = [
        new Product(
          'A Pillow',
          'https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg',
          'A soft pillow!',
          19.99
        ),
        new Product(
          'A Carpet',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg',
          'A carpet which you might like - or not.',
          89.99
        )
      ];

      this.renderProducts();
    }

    renderProducts(){
        this.products.forEach(prod => {
          const prodItem = new ProductItem(prod, 'prod-list');
      });
    }

    render() {
        this.createRootElement('ul','product-list', [new Attribute('id', 'prod-list')]);

        if(this.products && this.products.length > 0){
          renderProducts();
        }
    }
}

class Shop {
  constructor(){
    this.render();
  }

  render() {
    this.cart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
