import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { of, Subject } from 'rxjs';
import { ActionModel } from 'src/app/shared/interfaces/action-openModel';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mainService = jasmine.createSpyObj('MainService', ['openActionModal', 'openModal', "formatDate", "closeModal"]);
  let requestCallsService = jasmine.createSpyObj('RequestCallsService', [
    'getItems', "getFilterItemsByTitle", "getItemsByStatus", "getItemsForSearch",
    "getFilterItemsByID","getFilterItemsByDate", "getFilterItemsForPeriodDate", "getLastItem", "updateItem", "createItem"
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
    mainService.openActionModal = new Subject<ActionModel>();
    mainService.closeModal.and.returnValue('modalAction');
    requestCallsService.getLastItem.and.returnValue(of(item))


    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ],
      imports:[HttpClientTestingModule, ReactiveFormsModule],
      providers: [
       { provide: MainService, useValue: mainService },
       { provide: RequestCallsService, useValue: requestCallsService}
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    mainService = TestBed.inject(MainService);
    requestCallsService = TestBed.inject(RequestCallsService)

    fixture.detectChanges();
    mainService.openActionModal.next(actionModel)
  });

  it('should create', () => {
    fixture.detectChanges();
    mainService.openActionModal.next(actionModel)
    expect(component.isOpen).toBeTrue();
    expect(component).toBeTruthy();
  });

   it('should ngOnInit is called', () => {

  });

  it('should actionEditModal is called', () => {
    component.actionEditModal(item[0])
    expect(component.btnActionSubmit).toEqual('Atualizar');
  });

   it('should actionCreateModal is called', () => {
     component.form.patchValue({
      id:1,
      title: "Test 1",
      description:"test 01",
      status:"",
      date:""

    })

    component.actionCreateModal();
    expect(component.btnActionSubmit).toEqual('Salvar');
  });

   it('should submitForm is called EditCall', () => {
    //fixture.detectChanges();
    mainService.openActionModal.next(actionModel)
    requestCallsService.updateItem.and.returnValue(of(null));
    component.form.patchValue({
      id:1,
      title: "Test 1",
      description:"test 01",
      status:"",
      date:""

    })
    component.submitForm()
    expect(component.btnActionSubmit).toEqual('Atualizar');
  });

   it('should submitForm is called New_call', () => {

    actionModel.label = LabelNameModel.NEW_CALL;
    mainService.openActionModal.next(actionModel)
    requestCallsService.createItem.and.returnValue(of(item[0]))
    component.form.patchValue({
      id:1,
      title: "Test 2",
      description:"test 02",
      status:"",
      date:""

    })
    component.classIcon();
    component.submitForm();

    expect(component.btnActionSubmit).toEqual('Salvar');
    expect(component.msgAlert).toEqual(true)
  });
});
