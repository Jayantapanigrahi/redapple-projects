import { TestBed, async, inject } from '@angular/core/testing';

import { EmployeeAuthGuard } from './auth.guard.employee';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeAuthGuard]
    });EmployeeAuthGuard
  });

  it('should ...', inject([EmployeeAuthGuard], (guard: EmployeeAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
