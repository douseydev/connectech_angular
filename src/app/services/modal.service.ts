import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  title: string;
  type: 'add' | 'edit';
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<{ isOpen: boolean; config?: ModalConfig }>({ isOpen: false });
  public modal$ = this.modalSubject.asObservable();

  openModal(config: ModalConfig) {
    this.modalSubject.next({ isOpen: true, config });
  }

  closeModal() {
    this.modalSubject.next({ isOpen: false });
  }

  getModalState(): Observable<{ isOpen: boolean; config?: ModalConfig }> {
    return this.modal$;
  }
}
