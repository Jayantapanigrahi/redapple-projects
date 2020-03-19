import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CGHSComponent } from './cghs.component';

describe('CGHSComponent', () => {
  let component: CGHSComponent;
  let fixture: ComponentFixture<CGHSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CGHSComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CGHSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
