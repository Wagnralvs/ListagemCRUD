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

  getItems(page:number): Observable<HttpResponse<Item[]>> | any {
    const limit = 5;
    const params = new HttpParams()
    .set('_page', page)
    .set('_limit', limit);
    return this.http.get<Item[]>(`${this.apiUrl}/items`, {params, observe: 'response' })
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/items/${item.id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  getLastItem(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items?_sort=id&_order=desc&_limit=1`);
  }
}
