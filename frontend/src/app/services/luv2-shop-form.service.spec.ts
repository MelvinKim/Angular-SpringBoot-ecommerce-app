import { TestBed } from '@angular/core/testing';

import { Luv2ShopFormService } from './luv2-shop-form.service';

describe('Luv2ShopFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Luv2ShopFormService = TestBed.get(Luv2ShopFormService);
    expect(service).toBeTruthy();
  });
});
