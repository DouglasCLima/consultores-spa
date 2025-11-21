import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorListComponent} from './consultor-list.component';

describe('ConsultorList', () => {
  let component: ConsultorListComponent;
  let fixture: ComponentFixture<ConsultorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
