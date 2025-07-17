import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionModel } from '../../interfaces/action-openModel';
declare var bootstrap: any;
@Injectable({
  providedIn: 'root'
})
export class MainService {
  openActionModal = new Subject<ActionModel>();

  constructor() { }
  
  openModal(elementId: string): void {
    const modalElement = document.getElementById(elementId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(elementId:string): void {
    const modalElement = document.getElementById(elementId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  formatDate(date: Date): string {
    //const today = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
   // return `${day}/${month}/${year}`;
    return date.toLocaleDateString('pt-BR');
  }


}
