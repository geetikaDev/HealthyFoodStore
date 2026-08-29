import { TestBed } from '@angular/core/testing';

import { Razorpay } from './razorpay';

describe('Razorpay', () => {
  let service: Razorpay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Razorpay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
