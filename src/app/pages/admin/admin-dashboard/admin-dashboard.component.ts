import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ContactService } from '../../../services/contact.service';

declare const Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentDate = new Date();
  Math = Math;

  totalProducts = 0;
  totalCategories = 0;
  totalMessages = 0;
  categoryDistribution: { category: string; count: number; percentage?: number }[] = [];

  // instance Chart
  private chart: any = null;

  stats: any[] = [];

  // Produits récents (tirés du service)
  recentProducts: any[] = [];

  // Commandes récentes (stub)
  recentOrders = [
    { id: '001', client: 'Jean Dupont', amount: 1199400, status: 'Livré', date: '20/12/2025' },
    { id: '002', client: 'Marie Martin', amount: 2599400, status: 'En cours', date: '21/12/2025' },
    { id: '003', client: 'Pierre Renard', amount: 299400, status: 'En attente', date: '22/12/2025' },
    { id: '004', client: 'Sophie Bernard', amount: 899400, status: 'Livré', date: '21/12/2025' },
    { id: '005', client: 'Michel Thomas', amount: 1499400, status: 'En attente', date: '20/12/2025' },
    { id: '006', client: 'Isabelle Leclerc', amount: 599400, status: 'Livré', date: '19/12/2025' }
  ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    // Rediriger vers login si pas connecté
    if (!this.isLoggedIn) {
      this.router.navigate(['/admin/login']);
    }

    this.loadStats();
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/']);
  }

  loadStats() {
    this.productService.getProducts().subscribe(products => {
      this.recentProducts = products.slice(0, 6);
      this.totalProducts = products.length;
      this.updateStats();
    });

    this.categoryService.getCategories().subscribe(categories => {
      this.totalCategories = categories.length;

      // Use count from backend
      this.categoryDistribution = categories.map(c => ({
        category: c.name,
        count: c.count || 0,
        percentage: 0 // calculated below
      }));

      // Calculate percentages
      const total = this.categoryDistribution.reduce((sum, item) => sum + item.count, 0) || 1;
      this.categoryDistribution.forEach(c => c.percentage = Math.round((c.count / total) * 100));

      this.updateStats();
      setTimeout(() => this.renderChart(), 50);
    });

    // Messages remain mock for now as no API endpoint exists
    const messages = this.contactService.getMessages();
    this.totalMessages = messages.length;
    this.updateStats();
  }

  updateStats() {
    this.stats = [
      { label: 'Total produits', value: this.totalProducts, icon: '📦', type: 'products', period: 'Total' },
      { label: 'Catégories', value: this.totalCategories, icon: '🏷️', type: 'categories', period: 'Total' },
      { label: 'Messages', value: this.totalMessages, icon: '💬', type: 'messages', period: 'Non lus: ' + this.contactService.getUnreadCount() }
    ];
  }


  getColor(index: number) {
    const palette = ['#1E40AF', '#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#a78bfa'];
    return palette[index % palette.length];
  }

  renderChart() {
    try {
      if (!(window as any).Chart) return;
      const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const labels = this.categoryDistribution.map((c: any) => c.category);
      const data = this.categoryDistribution.map((c: any) => c.count);
      const colors = labels.map((_: any, i: number) => this.getColor(i));

      if (this.chart) this.chart.destroy();
      this.chart = new (window as any).Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    } catch (e) {
      console.warn('Chart render failed', e);
    }
  }

  getMaxCategoryCount(): number {
    if (!this.categoryDistribution || !this.categoryDistribution.length) return 1;
    return Math.max(...this.categoryDistribution.map(c => c.count), 1);
  }
  ngOnDestroy() {
    try {
      this.chart?.destroy();
    } catch (e) {
      // ignore
    }
  }

}
