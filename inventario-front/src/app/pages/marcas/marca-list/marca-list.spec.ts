import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaList } from './marca-list';

describe('MarcaList', () => {
  let component: MarcaList;
  let fixture: ComponentFixture<MarcaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
