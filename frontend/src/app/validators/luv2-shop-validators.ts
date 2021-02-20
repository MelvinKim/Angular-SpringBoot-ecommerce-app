import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

  //whitespace validation
  static notOnlyWhiteSpace(control: FormControl ) : ValidationErrors {

  //check to see if the string has only whitespace
  if((control.value != null && (control.value.trim().length === 0))) {

    //invalid, return error
    return { 'notOnlyWhiteSpace': true };
  }
  else {

    //valid,return null
    return null;
  }

  }
}
