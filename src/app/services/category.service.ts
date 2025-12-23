import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  count?: number; // Added for stats
}

const ICON_MAP: { [key: string]: string } = {
  'Smartphones': '📱',
  'Ordinateurs': '💻',
  'Tablettes': '📱',
  'Accessoires': '🎧',
  'Montres': '⌚',
};

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor(private http: HttpClient) {
    this.refreshCategories();
  }

  private refreshCategories() {
    this.getCategoriesFromApi().subscribe(cats => this.categoriesSubject.next(cats));
  }

  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  private getCategoriesFromApi(): Observable<Category[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/categories/stats`).pipe(
      map(response => response.data.map(item => ({
        id: item.id,
        name: item.nom,
        description: item.description,
        icon: ICON_MAP[item.nom] || '📦', // Default icon
        count: item.nombre_produits
      })))
    );
  }

  addCategory(cat: Category): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorie`, {
      nom: cat.name,
      description: cat.description
    }).pipe(tap(() => this.refreshCategories()));
  }

  updateCategory(updated: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/categorie/${updated.id}`, {
      nom: updated.name,
      description: updated.description
    }).pipe(tap(() => this.refreshCategories()));
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorie/${id}`)
      .pipe(tap(() => this.refreshCategories()));
  }
}
