import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';
import { MainService } from 'src/app/shared/services/main/main.service';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';
import { Item } from 'src/app/shared/interfaces/list-items';
import { SimpleChange } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConfirmDeleteModalComponent', () => {
  let component: ConfirmDeleteModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteModalComponent>;
  let mainService = jasmine.createSpyObj('MainService', ['openActionModal', 'openModal', "formatDate", "closeModal"]);
  let requestCallsService = jasmine.createSpyObj('RequestCallsService', [
    "deleteItem"
  ]);

  const item: Item = {
    id: 1,
    title: 'primeiro item',
    description: 'descrição do primeiro item',
    status: 'Aberto',
    data: '2025/07/15',
  };
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ConfirmDeleteModalComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MainService, useValue: mainService },
        { provide: RequestCallsService, useValue: requestCallsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteModalComponent);
    component = fixture.componentInstance;
    mainService = TestBed.inject(MainService);
    requestCallsService = TestBed.inject(RequestCallsService)

    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnChanges is called ', () => {
    const fakeChanges = {
      item: new SimpleChange(null,  item , false)
    };
    component.ngOnChanges(fakeChanges);
    expect(mainService.openModal).toHaveBeenCalled()
  });

  it('should deleteItem is called ', () => {
    requestCallsService.deleteItem.and.returnValue(of(item))
    component.deleteItem();
    expect(component).toBeTruthy();
  });
});
