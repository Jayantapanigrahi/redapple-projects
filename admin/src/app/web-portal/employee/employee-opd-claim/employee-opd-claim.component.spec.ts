import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOpdClaimComponent } from './employee-opd-claim.component';

describe('EmployeeOpdClaimComponent', () => {
  let component: EmployeeOpdClaimComponent;
  let fixture: ComponentFixture<EmployeeOpdClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOpdClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOpdClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
