import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  categories: string[] = ['Tous'];
  selectedCategory = 'Tous';
  sortBy = 'recent';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });

    this.categoryService.getCategories().subscribe(cats => {
      // Extract names and add 'Tous'
      this.categories = ['Tous', ...cats.map(c => c.name)];
    });
  }

  get filteredProducts() {
    let filtered = [...this.allProducts]; // Copy to avoid mutation issues if any

    if (this.selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.sortBy === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }
}
