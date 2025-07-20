import { TestBed } from '@angular/core/testing';

import { MainService } from './main.service';
declare var bootstrap: any;
describe('MainService', () => {
  let service: MainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainService);

    const mockModalInstance = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };
    (window as any).bootstrap = {
      Modal: function (element: any) {
        return {
          show: jasmine.createSpy('show'),
          hide: jasmine.createSpy('hide'),
        };
      },
    };

    (window as any).bootstrap.Modal.getInstance = jasmine.createSpy('getInstance').and.returnValue(mockModalInstance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should  openModal is called', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add = jasmine.createSpy('modalAction');

    spyOn(document, 'getElementById').and.returnValue(mockElement);
    service.openModal('modalAction')
    expect(service).toBeTruthy();
  });

  it('should  closeModal is called', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add = jasmine.createSpy('modalAction');

    spyOn(document, 'getElementById').and.returnValue(mockElement);
    service.closeModal('modalAction')
    expect(service).toBeTruthy();
  });
});
