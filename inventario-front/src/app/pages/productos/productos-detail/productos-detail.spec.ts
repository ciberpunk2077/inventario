import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDetail } from './productos-detail';

describe('ProductosDetail', () => {
  let component: ProductosDetail;
  let fixture: ComponentFixture<ProductosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
