import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BILLSComponent } from './bills.component';

describe('BILLSComponent', () => {
  let component: BILLSComponent;
  let fixture: ComponentFixture<BILLSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BILLSComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BILLSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
