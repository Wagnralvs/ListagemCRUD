import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs';
import { FilterActiveModel } from 'src/app/shared/interfaces/filter-active';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';

@Component({
  selector: 'list-of-calls',
  templateUrl: './list-of-calls.component.html',
  styleUrls: ['./list-of-calls.component.scss']
})
export class ListOfCallsComponent implements OnInit {
  items: Item[] = [];
  itemDeleted: Item = {} as Item;
  page: number = 1;
  pagesDinamic: number[] = [];
  totalPages: number = 0;
  loading = true;
  statusApi = 0;
  loadingFilter = false;
  actionFilter = false;
  limitPage = 5;
  filterByStatus = '';
  filterActiveModel: FilterActiveModel = FilterActiveModel.NONE;
  alertCreated = false;
  advancedFilter = false;
  dataLabel = 'Data';

  constructor(private requestCallsService: RequestCallsService, private mainService: MainService) { }

  ngOnInit(): void {
    this.loadItems();
    this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.mainService.openActionModal.subscribe(({ updateLoadingModal, lastAction }) => {
      if (updateLoadingModal) {
        this.alertCreated = lastAction || false;
        this.loading = true;
        this.loadItems();
      }
    });
  }

  loadItems(): void {
    this.requestCallsService.getItems(this.page).subscribe(
      (data: HttpResponse<Item[]>) => {
        this.items = data.body || [];
       this.controlPage(data);
      },
      ( error: any) => {
        this.loading = false;
        console.error('Error fetching items:', error);
      }
    );
  }

  navigationPage(page: number): void {
    this.page = page;
    
    switch (this.filterActiveModel) {
      case FilterActiveModel.NONE:
        this.loading = true;
        this.items = [];
        this.loadItems();
        break;
      case FilterActiveModel.ID:
        break;
      case FilterActiveModel.TITLE:
        this.onFilterItemsTitle(this.page);
        break;
      case FilterActiveModel.STATUS:
        this.onFilterItemsStatus(this.filterByStatus);
        break;
    }
  }

  newCallModal(): void {
    this.mainService.openActionModal.next({ isOpen: true, label: LabelNameModel.NEW_CALL });
  }

  editCallModal(item: Item): void {
    this.mainService.openActionModal.next({ isOpen: true, label: LabelNameModel.EDIT_CALL, item });
  }

  deleteCallModal(item: Item): void {
    this.itemDeleted = item;
  }

  // filtros
  onFilterItemsId(event: any): void {
    const ID: number = +event.target.value;

    if( ID > 0) {
      this.loadingFilter = true;
      this.actionFilter = true;
      this.requestCallsService.getFilterItemsByID( ID).pipe(
        map((response: HttpResponse<Item>) => {
          this.items = [response.body as Item];
          this.filterActiveModel = FilterActiveModel.ID;
          this.controlPage(response);

        }),
        catchError((error: HttpResponse<any>) => {
          this.items = [];
          this.loadingFilter = false;
          this.statusApi = error.status;
          console.error('Error fetching filtered items:', error.status, error.statusText);
          return [];
        })
      ).subscribe();
    }
  }

  onFilterItemsTitle(event: any): void {
    const title: string = event?.target?.value;
    this.loadingFilter = true;
    this.actionFilter = true;
    if( title === '') {
      this.resetFilters();
      return;
    }
    this.requestCallsService.getFilterItemsByTitle(title, this.page, this.limitPage).pipe(
      map((response: HttpResponse<Item[]>) => {
        this.items = response.body || [];
        this.filterActiveModel = FilterActiveModel.TITLE;
        this.controlPage(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching filtered items:', error);
        return [];
      })
    ).subscribe();
  }

  onFilterItemsStatus(event: any): void {
    const status = event?.target?.value ;
    this.loadingFilter = true;
    this.actionFilter = true;
    if(status) {
      this.filterByStatus = status;
      this.page = 1;
    }
    if( status === '') {
      this.resetFilters();
      return;
    }
    this.requestCallsService.getItemsByStatus(this.filterByStatus, this.page, this.limitPage).pipe(
      map((response: HttpResponse<Item[]>) => {
        this.items = response.body || [];
        this.filterActiveModel = FilterActiveModel.STATUS;
        this.controlPage(response);
      }),
      catchError((error: HttpResponse<any>) => {
        this.items = [];
        this.loadingFilter = false;
        this.statusApi = error.status;
        console.error('Error fetching filtered items:', error.status, error.statusText);
        return [];
      })
    ).subscribe();
  }

  onFilterItemsDate(event: any): void {
    const dateValue: string = event?.target?.value; 
  
    if(new Date(dateValue) > new Date('2025-01-01')) {
      const date: string = this.mainService.formatDate(new Date(`${dateValue}T12:00:00`));

      this.loadingFilter = true;
      this.actionFilter = true;
      this.requestCallsService.getFilterItemsByDate(date, this.page, this.limitPage).pipe(
        map((response: HttpResponse<Item[]>) => {
          this.items = response.body || [];
          this.filterActiveModel = FilterActiveModel.DATE;
          this.controlPage(response);
        }),
        catchError((error: HttpResponse<any>) => {
          this.items = [];
          this.loadingFilter = false;
          this.statusApi = error.status;
          console.error('Error fetching filtered items:', error.status, error.statusText);
          return [];
        })
      ).subscribe();
    }
  }

  onFilterAdvanced(): void {
    this.advancedFilter = true;
    this.dataLabel = 'Data de';
   }

  controlPage(data: any): void {
        const totalItens = Number(data.headers.get('X-Total-Count'));
        this.totalPages = Math.ceil(totalItens / this.limitPage);
        this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loading = false;
        this.loadingFilter = false;
  }

  resetFilters(input?: any[]): void {
    if(input) {
      input.forEach((el) => {
        el.value = '';
      });
    }
    this.items = [];
    this.actionFilter = false;
    this.filterActiveModel = FilterActiveModel.NONE;
    this.page = 1;
    this.advancedFilter = false;
    this.loadItems();
  }

}
