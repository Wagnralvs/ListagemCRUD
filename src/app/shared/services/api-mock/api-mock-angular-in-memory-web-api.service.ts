import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import db from 'src/assets/db.json';

@Injectable({
  providedIn: 'root'
})
export class ApiMockAngularInMemoryWebApiService implements InMemoryDbService {

  constructor() { }
    createDb() {
    return {
      items: (db as any).items,
    };
  }

   genId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(c => c.id)) + 1 : 1;
  }
}
