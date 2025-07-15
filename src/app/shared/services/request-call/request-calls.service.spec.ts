import { TestBed } from '@angular/core/testing';

import { RequestCallsService } from './request-calls.service';

describe('RequestCallsService', () => {
  let service: RequestCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
