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
  page: number = 1;
  pagesDinamic: number[] = [];
  totalPages: number = 0;

  constructor(private requestCallsService: RequestCallsService, private mainService: MainService) { }

  ngOnInit(): void {
    this.loadItems();
    this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  loadItems(): void {
    this.requestCallsService.getItems(this.page).subscribe(
      (data: HttpResponse<Item[]>) => {
        this.items = data.body || [];
       const totalItens = Number(data.headers.get('X-Total-Count'));
       this.totalPages = Math.ceil(totalItens / 5); // 5 itens por página
       this.pagesDinamic = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      ( error: any) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  navigationPage(page: number): void {
    this.page = page;
    this.loadItems();
  }

  newCallModal(): void {
    this.mainService.openModal.next({ isOpen: true, label: LabelNameModel.NEW_CALL });
  }

}
