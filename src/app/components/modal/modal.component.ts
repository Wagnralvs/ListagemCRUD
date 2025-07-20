import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, Subscriber, Subscription } from 'rxjs';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';

@Component({
  selector: 'call-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  // Variáveis para controle de exibição do modal
  isOpen: boolean = false;
  label: LabelNameModel | null = null;
  actionEdit = false;
  btnActionSubmit = '';
  msgAlert = false;
  private subscription: Subscription =  new Subscription();
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private mainService: MainService,
    private requestCallsService: RequestCallsService) {
     this.createForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.mainService.openActionModal.subscribe((openModel) => {
      this.isOpen = openModel.isOpen;
      this.label = openModel.label
      if (openModel.isOpen) {
        this.label === LabelNameModel.NEW_CALL ? this.actionCreateModal() : this.actionEditModal(openModel.item);
        this.mainService.openModal('modalAction');
      }
    });

  }


  createForm(): void {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      status: [null, [Validators.required]],
      id:[null],
      date: [this.mainService.formatDate(new Date())]
    });
  }

  actionEditModal(item:Item | undefined): void {
    if (item) {
      this.actionEdit = true;
      this.btnActionSubmit = 'Atualizar';
      this.form.get('id')?.setValue(item.id);
      this.form.get('title')?.setValue(item.title);
      this.form.get('description')?.setValue(item.description);
      this.form.get('status')?.setValue(item.status);
      this.form.get('date')?.setValue(item.data);
    }
  }

  actionCreateModal(): void {
    this.form.reset();
    this.btnActionSubmit = 'Salvar';
    this.actionEdit = false;
    this.form.get('date')?.setValue(this.mainService.formatDate(new Date()))
     this.requestCallsService.getLastItem().pipe(
      map((item: Item[]) => {
          this.form.get('id')?.setValue(item[0].id + 1);
      }),
      catchError((error:any) => {
        console.error('Erro ao obter o último item:', error);
        return [];
      })
     ).subscribe();
  }

  submitForm(): void {
     const itens :  Item = {
      id: this.form.value.id,
      title: this.form.value.title,
      description: this.form.value.description,
      status: this.form.value.status,
      data: this.form.value.date
    };
    if (this.label === LabelNameModel.NEW_CALL) {
      this.createCallSubmit(itens);
    } else {
      this.editCallSubmit(itens);
    }
  }
  editCallSubmit(item:Item): void {
    this.requestCallsService.updateItem(item).pipe(
      map(() => {
        this.msgAlert = true;
        this.mainService.openActionModal.next({ isOpen: false, updateLoadingModal: true, label: LabelNameModel.NONE });
        this.mainService.closeModal('modalAction');
        return ;
      }),
      catchError(error => {
        console.error('Erro ao atualizar chamado:', error);
        throw error;
      })
    ).subscribe();
  }

  createCallSubmit(item:Item): void {
    this.requestCallsService.createItem(item).pipe(
      map(() => {
        this.msgAlert = true;
        this.mainService.openActionModal.next({ isOpen: false, updateLoadingModal: true, lastAction:true, label: LabelNameModel.NONE });
        this.mainService.closeModal('modalAction');
        return ;
      }),
      catchError(error => {
        console.error('Erro ao criar chamado:', error);
        throw error;
      })
    ).subscribe();
  }

  classIcon(): string {
    return this.label == LabelNameModel.NEW_CALL ? 'bi bi-plus-lg' : 'bi bi-pencil';
  }
}
