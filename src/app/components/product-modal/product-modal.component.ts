import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css'
})
export class ProductModalComponent implements OnInit {
  @Output() save = new EventEmitter<any>();

  isOpen = false;
  isEditMode = false;
  categories: Category[] = [];

  formData = {
    id: null,
    name: '',
    categoryId: null, // bind to this
    price: null,
    stock: 0,
    description: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private modalService: ModalService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.modalService.getModalState().subscribe(state => {
      this.isOpen = state.isOpen;
      if (state.config) {
        this.isEditMode = state.config.type === 'edit';
        if (state.config.data) {
          // Map data to form
          const data = state.config.data;
          this.formData = {
            id: data.id,
            name: data.name,
            categoryId: data.categoryId || data.category_id,
            price: data.price,
            stock: data.stock,
            description: data.description
          };
          this.imagePreview = data.image; // Show existing image if edit

          if (!this.formData.categoryId && data.category) {
            const found = this.categories.find(c => c.name === data.category);
            if (found) {
              (this.formData as any).categoryId = found.id;
            }
          }
        } else {
          this.resetForm();
        }
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    return !!(this.formData.name && this.formData.categoryId && this.formData.price);
  }

  submitForm() {
    if (this.isFormValid()) {
      const cat = this.categories.find(c => c.id == this.formData.categoryId);

      this.save.emit({
        ...this.formData,
        category: cat ? cat.name : '',
        type: this.isEditMode ? 'edit' : 'add',
        file: this.selectedFile
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
      categoryId: null,
      price: null,
      stock: 0,
      description: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
