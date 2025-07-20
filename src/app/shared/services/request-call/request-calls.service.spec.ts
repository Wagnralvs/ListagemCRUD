import { TestBed } from '@angular/core/testing';

import { RequestCallsService } from './request-calls.service';
import { HttpClient,  HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Item } from '../../interfaces/list-items';
import { of } from 'rxjs';

describe('RequestCallsService', () => {
  let service: RequestCallsService;
   let http: HttpClient

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
  beforeEach(() => {
   // spyOn(String.prototype, 'charAt').and.returnValue('A')
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[HttpClient]
    });
    service = TestBed.inject(RequestCallsService);
    http = TestBed.inject(HttpClient)

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getItems called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getItems(1, 10).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

   it('should updateItem called success', ()=>{
    service.updateItem(item[0]).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

   it('should createItem called success', ()=>{
    service.createItem(item[0]).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

   it('should deleteItem called success', ()=>{
    service.deleteItem(1).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

  it('should getLastItem called success', ()=>{
    service.getLastItem().subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

  it('should getFilterItemsByID called success', ()=>{
    const spy = spyOn(String.prototype, 'charAt').and.callThrough()
    //spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getFilterItemsByID(1).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
    //expect(spy).toHaveBeenCalled()
  })

  it('should getItemsByStatus called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getItemsByStatus("Aberto", 1, 5).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

  it('should getFilterItemsByTitle called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getFilterItemsByTitle('', 1, 5).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

  it('should getFilterItemsByDate called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getFilterItemsByDate("", 1, 5).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

   it('should getFilterItemsForPeriodDate called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getFilterItemsForPeriodDate("", "", 1, 5).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })

   it('should getItemsForSearch called success', ()=>{
    spyOn(http, 'get').and.returnValue(of(new HttpResponse<Item[]>({ body: item, status: 200 })));
    service.getItemsForSearch("", 1, 5).subscribe((response:any) => {
      expect(response.body).toEqual(item);
    });
  })



});
