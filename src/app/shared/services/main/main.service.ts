import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LabelNameModel } from '../../interfaces/label-name-model';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  openModal = new Subject<{ isOpen: boolean, label: LabelNameModel | null }>();

  constructor() { }
}
