import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { FilterActiveModel } from 'src/app/shared/interfaces/filter-active';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';
import { Item } from 'src/app/shared/interfaces/list-items';
import { Url } from 'src/app/shared/interfaces/urls';
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
  limitPage = 10;
  filterByStatus = '';
  filterActiveModel: FilterActiveModel = FilterActiveModel.NONE;
  alertCreated = false;
  advancedFilter = false;
  dataLabel = 'Data';
  dataFilterAdvancedOf = '';
  dataFilterAdvancedTo = '';
  validDataAdvancedErro = false;
  btnFilterAdvanced = 'Filtros Avançados';
  iconBtnFilterAdvanced = 'bi bi-arrow-down-short';
  positionTitleInput = 'order-1';
  placeholderTitle = 'Título';
  searchValueAdvanced = '';
  btnFilterAdvanceJson = false;

  constructor(private requestCallsService: RequestCallsService, private mainService: MainService) { }

  ngOnInit(): void {
    this.btnFilterAdvanceJson = this.requestCallsService.apiUrl === Url.URL_SERVER_JSON? true : false;
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
    this.requestCallsService.getItems(this.page, this.limitPage).pipe(
      map((data: HttpResponse<Item[]>) => {
        this.items = data.body || [];
       this.controlPage(data);
      }),
      catchError((error) => {
        this.loading = false;
        console.error('Error fetching items:', error);
        return of()
      }
    )).subscribe();
  }

  navigationPage(page: number): void {
    this.page = page;

    switch (this.filterActiveModel) {
      case FilterActiveModel.NONE:
        this.loading = true;
        this.items = [];
        this.loadItems();
        break;
      case FilterActiveModel.TITLE:
        this.onFilterItemsTitle(this.page);
        break;
      case FilterActiveModel.STATUS:
        this.onFilterItemsStatus(this.filterByStatus);
        break;
      case FilterActiveModel.SEARCH_ADVANCED:
        this.onFilterForSearchAdvanced(this.searchValueAdvanced);
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

    if(new Date(dateValue) > new Date('2000-01-01')) {
      if(this.advancedFilter) {
        this.dataFilterAdvancedOf = dateValue;
        return;
      }
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

  onFilterItemDateAdvanced(event: any): void {
    this.dataFilterAdvancedTo = event?.target?.value;

    if (new Date(this.dataFilterAdvancedOf) <  new Date(this.dataFilterAdvancedTo)) {
      this.validDataAdvancedErro = false;
      this.dataFilterAdvancedTo = this.mainService.formatDate(new Date(`${this.dataFilterAdvancedTo}T12:00:00`));
      this.dataFilterAdvancedOf = this.mainService.formatDate(new Date(`${this.dataFilterAdvancedOf}T12:00:00`));
      this.loadingFilter = true;
      this.actionFilter = true;
      this.requestCallsService.getFilterItemsForPeriodDate(this.dataFilterAdvancedOf, this.dataFilterAdvancedTo, this.page, this.limitPage).pipe(
        map((response: HttpResponse<Item[]>) => {
          this.items = response.body || [];
          this.filterActiveModel = FilterActiveModel.PERIOD_DATE_ADVANCED;
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
    } else {
      this.validDataAdvancedErro = true;
      console.error('Data de início deve ser menor que a data final.');
    }
  }

  onFilterForSearchAdvanced(event: any): void {
    this.searchValueAdvanced = event?.target?.value || this.searchValueAdvanced;
    this.loadingFilter = true;
    this.actionFilter = true;
    this.requestCallsService.getItemsForSearch(this.searchValueAdvanced, this.page, this.limitPage).pipe(
      map((response: HttpResponse<Item[]>) => {
        this.items = response.body || [];
        this.filterActiveModel = FilterActiveModel.SEARCH_ADVANCED;
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

  onFilterAdvanced(): void {
    this.advancedFilter = !this.advancedFilter;
    this.dataLabel = 'Data de';
    if(this.advancedFilter) {
      this.btnFilterAdvanced = 'Ver menos';
      this.iconBtnFilterAdvanced = 'bi bi-arrow-up-short';
      this.positionTitleInput = 'order-3';
      this.dataLabel = 'Data de Início';
      this.placeholderTitle = 'Digite para buscar por título ou descrição';
    } else {
      this.resetFilters();
    }
  }

  controlFilterItemMode(event: any): void {
    this.advancedFilter ? this.onFilterForSearchAdvanced(event) : this.onFilterItemsTitle(event);
  }

  controlPage(data: any): void {
        this.totalPages = Number(data.headers.get('X-Total-Pages'));
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
    this.dataFilterAdvancedOf = '';
    this.dataFilterAdvancedTo = '';
    this.validDataAdvancedErro = false;
    this.btnFilterAdvanced = 'Filtros Avançados';
    this.iconBtnFilterAdvanced = 'bi bi-arrow-down-short';
    this.positionTitleInput = 'order-1';
    this.placeholderTitle = 'Título';
    this.searchValueAdvanced = '';
    this.loadItems();
  }

}
