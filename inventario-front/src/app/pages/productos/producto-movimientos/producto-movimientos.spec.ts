import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoMovimientos } from './producto-movimientos';

describe('ProductoMovimientos', () => {
  let component: ProductoMovimientos;
  let fixture: ComponentFixture<ProductoMovimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoMovimientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoMovimientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
