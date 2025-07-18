import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { of, Subject } from 'rxjs';
import { ActionModel } from 'src/app/shared/interfaces/action-openModel';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mainService = jasmine.createSpyObj('MainService', ['openActionModal', 'openModal', "formatDate"]);
   let requestCallsService = jasmine.createSpyObj('RequestCallsService', [
    'getItems', "getFilterItemsByTitle", "getItemsByStatus", "getItemsForSearch",
    "getFilterItemsByID","getFilterItemsByDate", "getFilterItemsForPeriodDate", "getLastItem"
  ]);

  const item :Item [] = [
        {
        "id": 1,
        "title": "primeiro item",
        "description": "descrição do primeiro item",
        "status": "Aberto",
        "data": "2025/07/15"
      },
      {
        "id": 2,
        "title": "segundo item atualizado",
        "description": "descrição do segundo item up",
        "status": "Fechado",
        "data": "2025/07/14"
      },
      {
        "id": 3,
        "title": "terceiro item up",
        "description": "descrição do terceiro item",
        "status": "Progresso",
        "data": "2025/07/13"
      },
    ]
    const actionModel:ActionModel = { isOpen: true, label: LabelNameModel.EDIT_CALL, updateLoadingModal: true, lastAction:true, item:item[0] }
  beforeEach(async () => {

    const subject = new Subject<any>;
    subject.next(actionModel)
     mainService.openActionModal = subject


    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ],
      imports:[HttpClientModule, ReactiveFormsModule],
      providers: [
       { provide: MainService, useValue: mainService }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    mainService = TestBed.inject(MainService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should actionEditModal is called', () => {
    component.actionEditModal(item[0])
    expect(component.btnActionSubmit).toEqual('Atualizar');
  });

   it('should actionCreateModal is called', () => {
     requestCallsService.getLastItem.and.returnValue(of(item))
    component.actionCreateModal()
    expect(component.btnActionSubmit).toEqual('Salvar');
  });

   xit('should submitForm is called', () => {
    component.label = LabelNameModel.EDIT_CALL;
    component.submitForm()
    expect(component.btnActionSubmit).toEqual('Salvar');
  });
});
