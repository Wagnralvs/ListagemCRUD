import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../../interfaces/list-items';
import { map, Observable } from 'rxjs';
import { ModeRequestApi, Url } from '../../interfaces/urls';

@Injectable({
  providedIn: 'root'
})
export class RequestCallsService {
  //apiUrl = Url.URL_SERVER_JSON; // para test com json server
  apiUrl = Url.URL_WEB_API; // api para in memorie api angular

  constructor(private http: HttpClient) { }

    getItems(page:number, limit:number): Observable<HttpResponse<Item[]>> | any {
    let filter:Item[] = [];

    return this.http.get<Item[]>(`${this.apiUrl}/items${this.urlForJsonServer(page, limit, '', ModeRequestApi.GET_ALL)}`, { observe: 'response' }).pipe(
      map((response: HttpResponse<Item[]>) => {
        if(response.body){
          filter = this.controlPageForMemoryWebApi(limit, page, response.body);
          filter.forEach(item => this.formatUpperCase(item));
        }
        return response.clone({body: filter, headers: this.newHttpHeaders(limit, response, [])});
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
    return this.http.get<Item[]>(`${this.apiUrl}/items${this.urlForJsonServer(0, 0, '', ModeRequestApi.GET_LAST_ITEM)}`).pipe(
      map(response => {
        if(response){
          const lastItem:any = [];
          lastItem.push(response.at(-1));
          return lastItem

        }
        return response
      })
    );
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
  let filter:Item[] = [];
  let filterPage:Item[] = [];
  return this.http.get<Item[]>(`${this.apiUrl}/items${this.urlForJsonServer(page, limit, status, ModeRequestApi.FILTER_STATUS)}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      if(response.body){
         filter = response.body?.filter(item =>{
         return item.status === status
        });
        filterPage = this.controlPageForMemoryWebApi(limit, page, filter);
        filterPage.forEach(item => this.formatUpperCase(item));
      }
      return  response.clone({body: filterPage, headers: this.newHttpHeaders(limit, response, filterPage)});
    })
  );;
  }

getFilterItemsByTitle(title: string, page:number, limit:number) {
  let filter:Item[] = [];
  return this.http.get<Item[]>(`${this.apiUrl}/items${this.urlForJsonServer(page, limit, title, ModeRequestApi.FILTER_TITULE)}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      if(response.body){
        filter = response.body?.filter(item => {
         return  item.title.toLowerCase().includes(title.toLowerCase());
        })
        filter.forEach(item => {
          this.formatUpperCase(item)
        });

      }
      return   response.clone({body: filter, headers: this.newHttpHeaders(limit, response, filter)});;
    })
  );;
}

getFilterItemsByDate(data: string, page:number, limit:number): Observable<HttpResponse<Item[]>> {
  let filter:Item[] = [];
  let filterPage:Item[] = [];

  return this.http.get<Item[]>(`${this.apiUrl}/items${this.urlForJsonServer(page, limit, data, ModeRequestApi.FILTER_DATA)}`, { observe: 'response' }).pipe(
    map((response: HttpResponse<Item[]>) => {
      if(response.body){
        filter = response.body?.filter(item => {
         return  item.data.includes(data);
        })
        filter.forEach(item => this.formatUpperCase(item));
      }
      return   response.clone({body: filter, headers: this.newHttpHeaders(limit, response, filter)});;
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

  private controlPageForMemoryWebApi(limit:number ,page:number, item :Item[]):Item[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    const filter = item.slice(start, end);
    return filter
  }

  private urlForJsonServer(page: number, limit: number, status = '', mode:ModeRequestApi): string{
    if(this.apiUrl === Url.URL_SERVER_JSON){
      let param = '';
      switch (mode){
        case ModeRequestApi.GET_ALL :
          param = `?_page=${page}&_limit=${limit}`;
          break;
        case ModeRequestApi.FILTER_STATUS:
          param = `?status=${status}&_page=${page}&_limit=${limit}`;
          break;
        case ModeRequestApi.GET_LAST_ITEM:
          param = '?_sort=id&_order=desc&_limit=1';
          break;
        case ModeRequestApi.FILTER_TITULE:
          param = `?title_like=${status}&_page=${page}&_limit=${limit}`;
          break;
        case ModeRequestApi.FILTER_DATA:
          param = `?data=${status}&_page=${page}&_limit=${limit}`;
          break;
      }
      return param
    }
     return ''
  }

  private newHttpHeaders(limit:number, item:HttpResponse<Item[]>, filter:Item[]):HttpHeaders{
    let newHeaders = new HttpHeaders();
    if(item.body){
      const length = filter.length > 0 ? filter.length : item.body.length
      const totalPages = Math.ceil(length / limit);
      newHeaders = item.headers.set('X-Total-Pages', totalPages.toString());
    }

    return newHeaders
  }

}
