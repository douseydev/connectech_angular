import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit {
  @Output() save = new EventEmitter<any>();

  isOpen = false;
  isEditMode = false;
  formData = {
    id: null,
    name: '',
    description: ''
  };

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.getModalState().subscribe(state => {
      this.isOpen = state.isOpen;
      if (state.config) {
        this.isEditMode = state.config.type === 'edit';
        if (state.config.data) {
          this.formData = { ...state.config.data };
        } else {
          this.resetForm();
        }
      }
    });
  }

  isFormValid(): boolean {
    return !!(this.formData.name);
  }

  submitForm() {
    if (this.isFormValid()) {
      this.save.emit({
        ...this.formData,
        type: this.isEditMode ? 'edit' : 'add'
      });
      this.closeModal();
    }
  }

  closeModal() {
    this.modalService.closeModal();
    this.resetForm();
  }

  private resetForm() {
    this.formData = {
      id: null,
      name: '',
      description: ''
    };
  }
}
