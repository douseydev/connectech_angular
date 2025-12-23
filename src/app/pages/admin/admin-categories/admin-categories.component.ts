import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CategoryService, Category } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private modalService: ModalService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  openAddModal() {
    this.modalService.openModal({
      title: 'Ajouter une catégorie',
      type: 'add'
    });
  }

  openEditModal(category: Category) {
    this.modalService.openModal({
      title: 'Modifier la catégorie',
      type: 'edit',
      data: category
    });
  }

  onCategorySave(event: any) {
    if (event.type === 'add') {
      const newCategory: any = {
        name: event.name,
        description: event.description
      };

      this.categoryService.addCategory(newCategory).subscribe(() => {
        this.notificationService.show('Catégorie ajoutée avec succès !', 'success');
        this.loadCategories();
      }, err => this.notificationService.show('Erreur lors de l\'ajout', 'error'));

    } else if (event.type === 'edit') {
      const updatedCategory: any = {
        id: event.id,
        name: event.name,
        description: event.description
      };

      this.categoryService.updateCategory(updatedCategory).subscribe(() => {
        this.notificationService.show('Catégorie modifiée avec succès !', 'success');
        this.loadCategories();
      }, err => this.notificationService.show('Erreur lors de la modification', 'error'));
    }
  }

  async deleteCategory(id: number) {
    const confirmed = await this.confirmService.confirm(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les produits associés resteront mais n\'auront plus de catégorie.'
    );

    if (confirmed) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.notificationService.show('Catégorie supprimée avec succès !', 'success');
        this.loadCategories();
      }, err => this.notificationService.show('Erreur lors de la suppression', 'error'));
    }
  }
}
