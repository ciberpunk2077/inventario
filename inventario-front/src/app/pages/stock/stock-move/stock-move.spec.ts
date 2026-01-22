import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMove } from './stock-move';

describe('StockMove', () => {
  let component: StockMove;
  let fixture: ComponentFixture<StockMove>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMove]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
