import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  cartDataQty = new EventEmitter<product[] | []>();
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }

  getProduct() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: string) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  updateProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  getDetails(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProductFinal(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product?.id}`,
      product
    );
  }

  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  searchProducts(query: string) {
    return this.http.get<product[]>(
      `http://localhost:3000/products?category=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');

    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartDataQty.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartDataQty.emit(cartData);
    }
  }

  removeFromCart(productId: string) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      // console.log('hi');
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId != item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartDataQty.emit(items);
    } else {
      // console.log('hello');
    }
  }

  removeLoginCart(cartId: string) {
    return this.http.delete('http://localhost:3000/Cart/' + cartId);
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/Cart', cartData);
  }

  getCartList(userId: string) {
    return this.http
      .get<product[]>('http://localhost:3000/Cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((res) => {
        // console.log(res);
        if (res && res.body) {
          this.cartDataQty.emit(res.body);
          // console.log(res.body);
        }
      });
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(
      'http://localhost:3000/Cart?userId=' + userData.id
    );
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(
      'http://localhost:3000/orders?userId=' + userData.id
    );
  }

  deleteCartItems(cartId: string) {
    return this.http
      .delete('http://localhost:3000/Cart/' + cartId)
      .subscribe((result) => {
        this.cartDataQty.emit([]);
      });
  }

  cancelOrder(orderId: string) {
    return this.http.delete('http://localhost:3000/orders/' + orderId);
  }
}
