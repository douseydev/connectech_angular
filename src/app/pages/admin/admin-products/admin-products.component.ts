import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { ProductService, Product } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private modalService: ModalService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  openAddModal() {
    this.modalService.openModal({
      title: 'Ajouter un produit',
      type: 'add'
    });
  }

  openEditModal(product: Product) {
    this.modalService.openModal({
      title: 'Modifier le produit',
      type: 'edit',
      data: product
    });
  }

  onProductSave(event: any) {
    if (event.type === 'add') {
      const newProduct: any = {
        name: event.name,
        // category: event.category,
        price: event.price,
        stock: event.stock,
        description: event.description,
        categoryId: event.categoryId
      };

      this.productService.addProduct(newProduct, event.file).subscribe(() => {
        this.notificationService.show('Produit ajouté avec succès !', 'success');
        this.loadProducts();
      }, err => this.notificationService.show('Erreur lors de l\'ajout', 'error'));

    } else if (event.type === 'edit') {
      const updatedProduct: any = {
        id: event.id,
        name: event.name,
        // category: event.category,
        price: event.price,
        stock: event.stock,
        description: event.description,
        categoryId: event.categoryId
      };

      this.productService.updateProduct(updatedProduct, event.file).subscribe(() => {
        this.notificationService.show('Produit modifié avec succès !', 'success');
        this.loadProducts();
      }, err => this.notificationService.show('Erreur lors de la modification', 'error'));
    }
  }

  async deleteProduct(id: number) {
    const confirmed = await this.confirmService.confirm(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.'
    );

    if (confirmed) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.notificationService.show('Produit supprimé avec succès !', 'success');
        this.loadProducts();
      }, err => this.notificationService.show('Erreur lors de la suppression', 'error'));
    }
  }
}
