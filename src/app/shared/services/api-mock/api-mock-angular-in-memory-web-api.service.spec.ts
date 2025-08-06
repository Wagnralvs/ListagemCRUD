import { TestBed } from '@angular/core/testing';

import { ApiMockAngularInMemoryWebApiService } from './api-mock-angular-in-memory-web-api.service';

describe('ApiMockAngularInMemoryWebApiService', () => {
  let service: ApiMockAngularInMemoryWebApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMockAngularInMemoryWebApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
