import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/services/products.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  constructor(
    private productsService: ProductsService
  ) { }

  private searchSubject: Subject<string> = new Subject<string>();
  products: Product[] = [];
  filteredProducts: Product[] = [];
  records: number = 0;
  searchKeyword: string = '';

  ngOnInit(): void {
    this.getFinancialProducts();

    this.searchSubject.pipe(debounceTime(500)).subscribe(() => {
      this.filterProducts();
    });
  }

  getFinancialProducts() {
    this.productsService.getFinancialProducts().subscribe({
      next: (response) => {
        this.products = response;
        this.records = this.products.length;
        this.filteredProducts = this.products.slice();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("Done");
      }
    })
  }

  onSearchChange() {
    this.searchSubject.next(this.searchKeyword);
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => this.matchesSearchCriteria(product));
    this.records = this.filteredProducts.length;
  }

  matchesSearchCriteria(product: Product): boolean {
    const lowerCaseKeyword = this.searchKeyword.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerCaseKeyword) ||
      product.description.toLowerCase().includes(lowerCaseKeyword)
    );
  }

  fechaFormateada(fechaString: string): string {
    const fechaUTC = new Date(fechaString).toUTCString();
    return new Date(fechaUTC).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}