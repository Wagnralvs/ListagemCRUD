import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, Subscriber, Subscription } from 'rxjs';
import { LabelNameModel } from 'src/app/shared/interfaces/label-name-model';
import { Item } from 'src/app/shared/interfaces/list-items';
import { MainService } from 'src/app/shared/services/main/main.service';
import { RequestCallsService } from 'src/app/shared/services/request-call/request-calls.service';

declare var bootstrap: any;
@Component({
  selector: 'call-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  // Variáveis para controle de exibição do modal
  isOpen: boolean = false;
  label: LabelNameModel | null = null;
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
    this.subscription = this.mainService.openModal.subscribe(({ isOpen, label }) => {
      this.isOpen = isOpen;
      this.label = label
      if (isOpen) {
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }
      this.requestCallsService.getLastItem().subscribe(item => {
        debugger
          this.form.get('id')?.setValue(item[0].id + 1);
          //this.form.patchValue(item[0]);

      });
    });


  }


  createForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      status: [Validators.required],
      id:[null],
      date: [this.formatDate()]
    });
  }

  // Método para fechar o modal
  closeModal(): void {
      const modalElement = document.getElementById('exampleModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
        modal.hide();
      }
      this.form.reset();
      this.ngOnDestroy();
  }



  createCallSubmit(): void {
    const itens :  Item = {
      id: this.form.value.id,
      title: this.form.value.title,
      description: this.form.value.description,
      status: this.form.value.status,
      data: this.form.value.date
    };

    this.requestCallsService.createItem(itens).pipe(
      map(() => {
        this.msgAlert = true;
        this.mainService.openModal.next({ isOpen: false, label: null });
        debugger
        this.closeModal();
        return ;
      }),
      catchError(error => {
        console.error('Erro ao criar chamado:', error);
        throw error; // Re-throw the error to handle it in the subscription
      })
    ).subscribe();
  }

  formatDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  classIcon(): string {
    return this.label == LabelNameModel.NEW_CALL ? 'bi bi-plus-lg' : 'bi bi-pencil';
  }
}
