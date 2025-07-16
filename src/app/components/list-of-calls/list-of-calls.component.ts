import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  openDeleteModal: boolean = false;
  page: number = 1;
  pagesDinamic: number[] = [];
  totalPages: number = 0;
  loading = true;

  constructor(private requestCallsService: RequestCallsService, private mainService: MainService) { }

  ngOnInit(): void {
    this.loadItems();
    this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.mainService.openActionModal.subscribe(({ updateLoadingModal }) => {
      if (updateLoadingModal) {
        this.loading = true;
        this.loadItems();
      }
    });
  }

  loadItems(): void {
    this.requestCallsService.getItems(this.page).subscribe(
      (data: HttpResponse<Item[]>) => {
        this.items = data.body || [];
       const totalItens = Number(data.headers.get('X-Total-Count'));
       this.totalPages = Math.ceil(totalItens / 5); // 5 itens por página
       this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
       this.loading = false;
      },
      ( error: any) => {
        this.loading = false;
        console.error('Error fetching items:', error);
      }
    );
  }

  navigationPage(page: number): void {
    this.loading = true;
    this.page = page;
    this.loadItems();
  }

  newCallModal(): void {
    this.mainService.openActionModal.next({ isOpen: true, label: LabelNameModel.NEW_CALL });
  }

  editCallModal(item: Item): void {
    this.mainService.openActionModal.next({ isOpen: true, label: LabelNameModel.EDIT_CALL, item });
  }

  deleteCallModal(item: Item): void {
    this.openDeleteModal = true;
    this.itemDeleted = item;
  }

}
