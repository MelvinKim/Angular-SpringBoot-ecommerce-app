import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router ) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                [Validators.required,
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhiteSpace]
        ),

        lastName: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),

        email: new FormControl('',
                              [Validators.required,
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('',
                                  Validators.required),
        state: new FormControl('',
                                  Validators.required),
        zipCode: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        city:new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('',
                                  Validators.required),
        state: new FormControl('',
                                  Validators.required),
        zipCode: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
       creditCard: this.formBuilder.group({
        cardType: new FormControl('',
                                  Validators.required),
        nameOnCard: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required,
                                  Validators.pattern('[0-9]{16}')]),
        securityCode:  new FormControl('',[Validators.required,
                                  Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    //populate the months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start Month"+ startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate the years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //populate the countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Received countries data: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }


  reviewCartDetails() {

    //subscribe to CartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )

    //subscribe to CartService.totalQuantity
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )

  }

  onSubmit() {
    console.log(`handling form submission`);

    if(this.checkoutFormGroup.invalid) {
      //triggers displaying all the errors messages
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items from the cartService
    const cartItems = this.cartService.cartItems;

    //create orderItems from CartItems == long way of doing it
    // let orderItems: OrderItem[] = [];
    // for(let i=0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

     //create orderItems from CartItems
    // => short way of doing it
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //setup the purchase
    let purchase= new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase -  shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
 
    //populate purchase -  billingAddress
    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;



    //populate purchase  - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //Call REST API after populating data via checkoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\n tracking number: ${response.orderTrackingNumber}`);

          //reset CART
          this.resetCart();
        },
       error: err => {
         alert(`An error occurred: ${err.mesage}`)
       }
      }
    )




    //log form data
    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log(this.checkoutFormGroup.get('customer').value.email);

    // //log selected country name and state
    // console.log(`The shipping address country is: ${this.checkoutFormGroup.get('shippingAddress').value.country.name}`);
    // console.log(`The shipping address state  is: ${this.checkoutFormGroup.get('shippingAddress').value.state.name}`);

  }
  resetCart() {

    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutFormGroup.reset();

    //go back to main product page
    this.router.navigateByUrl("/products");

  }


  // get the fields for validation
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }


  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }


  // billing address
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get  billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get  billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get  billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get  billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

   get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
   get  creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

   get  creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

   get  creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }



  copyShippingAddressToBillingAddress(event) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //bug fix code
      //assign billing address states to shipping address
      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    //get the credit card form group
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);


    //check if current year equals selected year +. if so select at the current month
    let startMonth: number;

    if(currentYear === selectedYear ){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        //select the 1st state as the default state
        formGroup.get('state').setValue(data[0]);

      }
    );

  }

}
