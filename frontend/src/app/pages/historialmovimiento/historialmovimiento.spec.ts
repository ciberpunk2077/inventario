import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HistorialmovimientoComponent } from './historialmovimiento';
import { MovimientoInventarioComponent } from './historialmovimiento';

describe('MovimientoInventarioComponent', () => {
  let component: MovimientoInventarioComponent;
  let fixture: ComponentFixture<MovimientoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
