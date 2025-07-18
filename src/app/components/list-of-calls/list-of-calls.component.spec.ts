import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListOfCallsComponent } from './list-of-calls.component';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { MainService } from 'src/app/shared/services/main/main.service';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';
import { Item } from 'src/app/shared/interfaces/list-items';
import { of, Subject, throwError } from 'rxjs';
import { FilterActiveModel } from 'src/app/shared/interfaces/filter-active';

describe('ListOfCallsComponent', () => {
  let component: ListOfCallsComponent;
  let fixture: ComponentFixture<ListOfCallsComponent>;
  let requestService: RequestCallsService;
  let mainService = jasmine.createSpyObj('MainService', ['openActionModal', 'openModal', "formatDate"]);
  let requestCallsService = jasmine.createSpyObj('RequestCallsService', [
    'getItems', "getFilterItemsByTitle", "getItemsByStatus", "getItemsForSearch",
    "getFilterItemsByID","getFilterItemsByDate", "getFilterItemsForPeriodDate"
  ]
  )

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

  beforeEach(async () => {
    requestCallsService.getItems.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    mainService.openActionModal = new Subject<{ isOpen: boolean,  label: string,updateLoadingModal:boolean, item?: Item }>();
    mainService.openActionModal.next({ isOpen: true, label: 'New Call', updateLoadingModal: true, lastAction:'create' });

    await TestBed.configureTestingModule({
      declarations: [ ListOfCallsComponent, ConfirmDeleteModalComponent ],
      imports: [HttpClientModule],
      providers: [
        { provide: MainService, useValue: mainService },
        { provide: RequestCallsService, useValue: requestCallsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfCallsComponent);
    component = fixture.componentInstance;
    requestService = TestBed.inject(RequestCallsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getItems call erro on loadItems', () => {
    requestCallsService.getItems.and.returnValue(of(throwError(()=> new Error('erro item'))));
    component.ngOnInit();

    expect(requestCallsService.getItems).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();

  });

  it('should navigationPage is called with modo NONE', ()=> {
    component.navigationPage(1);
    expect(component.filterActiveModel).toEqual(FilterActiveModel.NONE)
  })

    it('should navigationPage is called with modo TITLE', ()=> {
    component.filterActiveModel = FilterActiveModel.TITLE;
    requestCallsService.getFilterItemsByTitle.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.navigationPage(1);

    expect(component.filterActiveModel).toEqual(FilterActiveModel.TITLE);
    expect(component.actionFilter).toEqual(true);
  });

  it('should navigationPage is called with modo STATUS', ()=> {
    component.filterActiveModel = FilterActiveModel.STATUS;
    requestCallsService.getItemsByStatus.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.navigationPage(1);

    expect(component.filterActiveModel).toEqual(FilterActiveModel.STATUS);
    expect(component.actionFilter).toEqual(true);
    expect(component.items).toEqual(item)
  });

   it('should navigationPage is called with modo SEARCH_ADVANCED', ()=> {
    component.filterActiveModel = FilterActiveModel.SEARCH_ADVANCED;
    requestCallsService.getItemsForSearch.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.navigationPage(1);

    expect(component.filterActiveModel).toEqual(FilterActiveModel.SEARCH_ADVANCED);
    expect(component.actionFilter).toEqual(true);
    expect(component.items).toEqual(item)
  });

   it('should onFilterItemsId return success ', ()=>{
    const event ={
      target:{
        value: "1"
      }
    }
    requestCallsService.getFilterItemsByID.and.returnValue(of(new HttpResponse<Item>({ body: item[0], status: 200 })))
    component.onFilterItemsId(event);

    expect(component.filterActiveModel).toEqual(FilterActiveModel.ID)
  })

   it('should onFilterItemsId return erro ', ()=>{
    const event ={
      target:{
        value: "1"
      }
    }
    requestCallsService.getFilterItemsByID.and.returnValue(of(throwError(()=> new Error('erro no request status'))))
    component.onFilterItemsId(event);

    expect(component.filterActiveModel).toEqual(FilterActiveModel.ID);
    expect(component.items).toEqual([]);
  })


   it('should onFilterItemsStatus return erro ', ()=>{
    requestCallsService.getItemsByStatus.and.returnValue(throwError(()=> new Error('erro no request status')))
    component.onFilterItemsStatus("");

    expect(component.loadingFilter).toEqual(false)
  })

    it('should onFilterItemsStatus return value null ', ()=>{
    const event ={
      target:{
        value: ""
      }
    }
    component.onFilterItemsStatus(event);
    expect(component.loadingFilter).toEqual(false)
    expect(component.filterActiveModel).toEqual(FilterActiveModel.NONE)
  })

   it('should onFilterItemsStatus return value valid ', ()=>{
    const event ={
      target:{
        value: "Aberto"
      }
    }
    requestCallsService.getItemsByStatus.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.onFilterItemsStatus(event);
    expect(component.filterByStatus).toEqual(event.target.value)
  })

  it('should onFilterItemsTitle return erro ', ()=>{
    requestCallsService.getFilterItemsByTitle.and.returnValue(of(throwError(()=> new Error('erro no request status'))))
    component.onFilterItemsTitle("");

   // expect(component.loadingFilter).toEqual(false)
  })

  it('should onFilterItemsTitle return value null ', ()=>{
    const event ={
      target:{
        value: ""
      }
    }
    component.onFilterItemsTitle(event);
    expect(component.loadingFilter).toEqual(false)
    expect(component.filterActiveModel).toEqual(FilterActiveModel.NONE)
  })

   it('should onFilterItemsDate return value valid ', ()=>{
    const event ={
      target:{
        value: "2025-01-01"
      }
    }
    mainService.formatDate.and.returnValue('01/01/2025')
    requestCallsService.getFilterItemsByDate.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.onFilterItemsDate(event);
    expect(component.filterActiveModel).toEqual(FilterActiveModel.DATE)
  })

   it('should onFilterItemsDate return erro ', ()=>{
    const event ={
      target:{
        value: "2025-01-01"
      }
    }
    mainService.formatDate.and.returnValue('01/01/2025')
    requestCallsService.getFilterItemsByDate.and.returnValue(of(throwError(()=> new Error('erro no request status'))))
    component.onFilterItemsDate(event);
    expect(component.loadingFilter).toEqual(false)
  })

   it('should onFilterItemDateAdvanced return value valid success ', ()=>{
    const event ={
      target:{
        value: "2025-07-01"
      }
    }
    component.dataFilterAdvancedOf = "2025-06-01"
    mainService.formatDate.and.returnValue('2025-07-01')
    requestCallsService.getFilterItemsForPeriodDate.and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })))
    component.onFilterItemDateAdvanced(event);
    expect(component.filterActiveModel).toEqual(FilterActiveModel.PERIOD_DATE_ADVANCED)
  })

   it('should onFilterItemsDate return value valid with advancedFilter ', ()=>{
    const event ={
      target:{
        value: "2025-07-01"
      }
    }
    component.advancedFilter = true;
    component.dataFilterAdvancedOf = "2025-06-01"
    mainService.formatDate.and.returnValue('2025-07-01')
    component.onFilterItemsDate(event);
    expect(component.dataFilterAdvancedOf).toEqual(event.target.value)
  })

    it('should onFilterItemDateAdvanced return value invalid  ', ()=>{
    const event ={
      target:{
        value: "2025-05-01"
      }
    }
    component.dataFilterAdvancedOf = "2025-06-01"
    mainService.formatDate.and.returnValue('2025-05-01')
    component.onFilterItemDateAdvanced(event);
    expect(component.validDataAdvancedErro).toEqual(true)
  })

   it('should onFilterItemDateAdvanced return value valid with request erro ', ()=>{
    const event ={
      target:{
        value: "2025-07-01"
      }
    }
    component.dataFilterAdvancedOf = "2025-06-01"
    mainService.formatDate.and.returnValue('2025-07-01')
    requestCallsService.getFilterItemsForPeriodDate.and.returnValue(of(throwError(()=> new Error('erro no request status'))))
    component.onFilterItemDateAdvanced(event);
    expect(component.filterActiveModel).toEqual(FilterActiveModel.PERIOD_DATE_ADVANCED)
  })

    it('should onFilterAdvanced is called with actionfilter', ()=>{
    component.actionFilter = false;
    component.onFilterAdvanced();
    expect(component.btnFilterAdvanced).toEqual('Ver menos')
  })

  it('should deleteCallModal is called ', ()=>{
    component.deleteCallModal(item[0]);
    expect(component.itemDeleted).toEqual(item[0])
  })


});
