import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HistorialmovimientoComponent } from './historialmovimiento';
import { HistorialMovimientosComponent } from './historialmovimiento';

describe('HistorialMovimientosComponent', () => {
  let component: HistorialMovimientosComponent;
  let fixture: ComponentFixture<HistorialMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
