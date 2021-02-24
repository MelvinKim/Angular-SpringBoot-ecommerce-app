import { CartItem } from "./cart-item";

export class OrderItem {

  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: string;

  //we want to construct the order item based on the cartItem
  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.unitPrice = cartItem.unitPrice;
    this.quantity = cartItem.quantity;
    this.productId = cartItem.id;
  }

}
