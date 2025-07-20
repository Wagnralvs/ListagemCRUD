import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../../interfaces/list-items';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestCallsService {
  private apiUrl = 'http://localhost:3000'; // Replace with your API URL
  constructor(private http: HttpClient) { }

  getItems(page:number, limit:number): Observable<HttpResponse<Item[]>> | any {
    const params = new HttpParams()
    .set('_page', page)
    .set('_limit', limit);
    return this.http.get<Item[]>(`${this.apiUrl}/items`, {params, observe: 'response' }).pipe(
      map((response: HttpResponse<Item[]>) => {
        response.body?.forEach(item => this.formatUpperCase(item));
        return response;
      })
    );
  }

  createItem(item: Item): Observable<Item> {
    item.title = item.title.toLowerCase();
    return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }

  updateItem(item: Item): Observable<Item> {
    item.title = item.title.toLowerCase();
    return this.http.put<Item>(`${this.apiUrl}/items/${item.id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  getLastItem(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items?_sort=id&_order=desc&_limit=1`);
  }
  getFilterItemsByID(id: number): Observable<HttpResponse<Item>> {
     return this.http.get<Item>(`${this.apiUrl}/items/${id}`, { observe: 'response' }).pipe(
       map((response: HttpResponse<Item>) => {
         this.formatUpperCase(response.body as Item)  ;
         return response;
       })
     );
   }

  getItemsByStatus(status: string, page:number, limit:number):Observable<HttpResponse<Item[]>> | any {
  return this.http.get<Item[]>(`${this.apiUrl}/items?status=${status}&_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      response.body?.forEach(item => this.formatUpperCase(item));
      return response;
    })
  );;
  }

  getFilterItemsByTitle(title: string, page:number, limit:number) {
  return this.http.get<Item[]>(`${this.apiUrl}/items?title_like=${title}&_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      response.body?.forEach(item => this.formatUpperCase(item));
      return response;
    })
  );;
}

getFilterItemsByDate(data: string, page:number, limit:number): Observable<HttpResponse<Item[]>> {
  return this.http.get<Item[]>(`${this.apiUrl}/items?data=${data}&_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      response.body?.forEach(item => this.formatUpperCase(item));
      return response;
    })
  );
}

getFilterItemsForPeriodDate(dataStart: string, dataEnd: string, page:number, limit:number):Observable<HttpResponse<Item[]>> {
  return this.http.get<Item[]>(`${this.apiUrl}/items?data_gte=${dataStart}&data_lte=${dataEnd}&_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      response.body?.forEach(item => this.formatUpperCase(item));
      return response;
    })
  );
}

getItemsForSearch(search: string, page:number, limit:number): Observable<HttpResponse<Item[]>> {
  return this.http.get<Item[]>(`${this.apiUrl}/items?q=${search}&_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      response.body?.forEach(item => this.formatUpperCase(item));
      return response;
    })
  );
}


  private formatUpperCase(item:Item): Item {
      item.title = item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase();
      item.description = item.description.charAt(0).toUpperCase() + item.description.slice(1).toLowerCase();
    return item
  }

}
