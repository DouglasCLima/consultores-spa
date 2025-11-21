import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorForm } from './consultor-form.component';

describe('ConsultorForm', () => {
  let component: ConsultorForm;
  let fixture: ComponentFixture<ConsultorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
