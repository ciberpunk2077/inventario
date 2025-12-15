import { TestBed } from '@angular/core/testing';

import { Provedor } from './provedor';

describe('Provedor', () => {
  let service: Provedor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Provedor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
