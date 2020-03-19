import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEstimationSubmissionComponent } from './hospital-estimation-submission.component';

describe('HospitalEstimationSubmissionComponent', () => {
  let component: HospitalEstimationSubmissionComponent;
  let fixture: ComponentFixture<HospitalEstimationSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalEstimationSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalEstimationSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
