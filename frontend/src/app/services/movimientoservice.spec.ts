import { TestBed } from '@angular/core/testing';

import { Movimientoservice } from './movimientoservice';

describe('Movimientoservice', () => {
  let service: Movimientoservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Movimientoservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
