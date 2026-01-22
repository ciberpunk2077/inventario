import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDetail } from './compra-detail';

describe('CompraDetail', () => {
  let component: CompraDetail;
  let fixture: ComponentFixture<CompraDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
