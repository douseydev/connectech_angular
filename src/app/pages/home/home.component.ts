import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];

  advantages = [
    { icon: '✓', title: 'Produits Authentiques', description: 'Garantis 100% originaux' },
    { icon: '🚚', title: 'Livraison Rapide', description: 'En 2-3 jours ouvrables' },
    { icon: '🛡️', title: 'Garantie Complète', description: 'Protection d\'achat' },
    { icon: '💬', title: 'Support 24/7', description: 'Via WhatsApp' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      // Show first 6 products as featured
      this.products = products.slice(0, 6);
    });

    this.categoryService.getCategories().subscribe(categories => {
      // Show first 4 categories
      this.categories = categories.slice(0, 4);
    });
  }
}
