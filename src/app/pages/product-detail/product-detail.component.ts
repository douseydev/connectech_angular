import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  allProducts: Product[] = []; // Used for "related products"

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (id) {
        this.loadProduct(id);
      }
    });

    // Load other products for recommendations
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        window.scrollTo(0, 0); // Scroll to top when loading new product
      },
      error: () => {
        this.router.navigate(['/produits']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/produits']);
  }

  contactViaWhatsApp() {
    if (!this.product) return;
    const message = `Bonjour! Je suis intéressé par le produit: ${this.product.name} (${this.product.price} FCFA)`;
    // Replace with real number
    const phoneNumber = '221772516507';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }
}
