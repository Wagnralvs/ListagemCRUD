import { catchError, map } from 'rxjs';
import { RequestCallsService } from './../../shared/services/request-call/request-calls.service';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';

@Component({
  selector: 'confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent implements OnChanges {
  @Input() item: Item  = {} as Item;

  constructor(
    private requestCallsService: RequestCallsService,
    private mainService: MainService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'].currentValue.id) {
      this.mainService.openModal('modalDelete');
    }
  }


  deleteItem(): void {
    this.requestCallsService.deleteItem(this.item.id).pipe(
      map(() => {
        this.mainService.closeModal('modalDelete');
        this.item = {} as Item;
        this.mainService.openActionModal.next({ isOpen: false, updateLoadingModal: true, label: LabelNameModel.NONE });
      }),
      catchError((error) => {
        console.error('Error deleting item:', error);
        return [];
      })
    ).subscribe();
  }

}
