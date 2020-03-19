import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndResponsibilityComponent } from './rolesandresponsibility.component';

describe('RolesAndResponsibilityComponent', () => {
  let component: RolesAndResponsibilityComponent;
  let fixture: ComponentFixture<RolesAndResponsibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolesAndResponsibilityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
