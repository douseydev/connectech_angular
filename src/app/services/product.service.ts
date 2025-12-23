import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock?: number;
  description?: string;
  image?: string;
  categoryId?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}`;
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.refreshProducts();
  }

  private refreshProducts() {
    this.getProductsFromApi().subscribe(products => this.productsSubject.next(products));
  }

  private getProductsFromApi(): Observable<Product[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/produits`).pipe(
      map(response => response.data.map(item => ({
        id: item.id,
        name: item.nom,
        category: item.categorie?.nom || 'Inconnu',
        price: item.prix,
        stock: item.stock,
        description: item.description,
        image: item.image,
        categoryId: item.categorie_id
      })))
    );
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/produit/${id}`).pipe(
      map(response => {
        const item = response.data;
        return {
          id: item.id,
          name: item.nom,
          category: item.categorie?.nom || 'Inconnu',
          price: item.prix,
          stock: item.stock,
          description: item.description,
          image: item.image,
          categoryId: item.categorie_id
        };
      })
    );
  }

  addProduct(p: Product, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', p.name);
    formData.append('description', p.description || '');
    formData.append('prix', p.price.toString());
    formData.append('stock', (p.stock || 0).toString());
    formData.append('disponible', '1');
    if (p.categoryId) {
      formData.append('categorie_id', p.categoryId.toString());
    }
    if (file) {
      formData.append('image', file);
    }

    return this.http.post(`${this.apiUrl}/produit`, formData)
      .pipe(tap(() => this.refreshProducts()));
  }

  updateProduct(updated: Product, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', updated.name);
    formData.append('description', updated.description || '');
    formData.append('prix', updated.price.toString());
    formData.append('stock', (updated.stock || 0).toString());
    if (updated.categoryId) {
      formData.append('categorie_id', updated.categoryId.toString());
    }
    if (file) {
      formData.append('image', file);
    }

    // Laravel requires _method=PUT or POST with /id for FormData update
    // Using POST with /id as defined in routes: Route::post('/{id}', [ProduitController::class, 'update']);
    return this.http.post(`${this.apiUrl}/produit/${updated.id}`, formData)
      .pipe(tap(() => this.refreshProducts()));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produit/${id}`)
      .pipe(tap(() => this.refreshProducts()));
  }
}
