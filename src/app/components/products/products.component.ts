import { Component, ElementRef, HostListener } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/services/products.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  constructor(
    private productsService: ProductsService,
    private el: ElementRef,
    private sharedDataService: SharedDataService,
    private router: Router
  ) { }

  private searchSubject: Subject<string> = new Subject<string>();
  products: Product[] = [];
  filteredProducts: Product[] = [];
  records: number = 0;
  searchKeyword: string = '';
  selectProduct: Product | null = null;
  isFiltering: boolean = false;

  pageSizeOptions = [5, 10, 20];
  currentPage = 1;
  pageSize = 5;

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
        this.updateDisplayedProducts();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("Done");
      }
    });
  }

  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = this.products.slice(startIndex, endIndex);
    this.records = this.products.length;
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayedProducts();
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  totalPages(): number {
    console.log(this.isFiltering);
    if (!this.isFiltering) {
      return Math.ceil(this.products.length / this.pageSize);
    } else {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
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
    if (lowerCaseKeyword == "") {
      this.isFiltering = false;
      this.getFinancialProducts();
      this.totalPages();
      this.totalPagesArray();
      return true;
    }
    this.isFiltering = true;
    return (
      product.name.toLowerCase().includes(lowerCaseKeyword) ||
      product.description.toLowerCase().includes(lowerCaseKeyword)
    );
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    const dotsContainer = this.el.nativeElement.querySelector('.dots-container');

    const isInsideMenu = dotsContainer.contains(event.target);

    if (!isInsideMenu && this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  toggleMenu(event: MouseEvent, product: Product): void {
    this.selectProduct = product;
    const dotsContainer = this.el.nativeElement.querySelector('.dots-container');
    const dropdownContent = this.el.nativeElement.querySelector('.dropdown-content');

    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      const rect = dotsContainer.getBoundingClientRect();

      dropdownContent.style.position = 'fixed';
      dropdownContent.style.top = `${event.clientY + 8}px`;
      dropdownContent.style.left = `${rect.left}px`;

      dropdownContent.style.display = 'block';
      dotsContainer.classList.add('show-menu');
      event.stopPropagation();
    }
  }

  private isMenuOpen(): boolean {
    const dropdownContent = this.el.nativeElement.querySelector('.dropdown-content');
    return dropdownContent.style.display === 'block';
  }

  private closeMenu(): void {
    const dotsContainer = this.el.nativeElement.querySelector('.dots-container');
    const dropdownContent = this.el.nativeElement.querySelector('.dropdown-content');
    dropdownContent.style.display = 'none';
    dotsContainer.classList.remove('show-menu');
  }

  editProduct(): void {
    this.sharedDataService.setProductData(this.selectProduct);
    this.router.navigate(['/edit-product']);
  }

  deleteProduct(): void {
    const deleteId = this.selectProduct?.id;
    Swal.fire({
      text: `¿Estás seguro de eliminar el producto ${this.selectProduct?.name}?`,
      showCancelButton: true,
      cancelButtonColor: '#ccc',
      confirmButtonColor: '#ffdd00',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      reverseButtons: true,
      customClass: 'swal-text',
    }).then((result) => {

      if (result.isConfirmed) {

        this.productsService.deleteFinancialProduct(deleteId).subscribe({
          next: (response) => {
            this.showSuccessMessage('Producto eliminado correctamente');
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1000);
          },
          error: (error) => {
            console.error('Error', error);
            if (error.status === 400) {
              console.log(error);
            } else {
              this.showErrorMessage('Error al eliminar el producto');
            }
          },
          complete: () => {
            console.log("Done");
          }
        })
      }
    });
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
      timer: 1500
    });
  }
}