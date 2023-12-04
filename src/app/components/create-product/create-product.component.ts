import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {

  formCreate: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formCreate = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.validateReleaseDate.bind(this)]],
      revisionDate: [{ value: '', disabled: true }],
      date_revision: ['']
    });
  }

  submitForm(): void {
    if (this.formCreate.valid) {

      this.productsService.createFinancialProduct(this.formCreate.value).subscribe({
        next: (response) => {
          this.showSuccessMessage('Producto creado correctamente');
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error', error);
          if (error.status === 400) {
            this.showErrorMessage('El producto ya existe');
            this.formCreate.get('id')?.setValue('');
          } else {
            this.showErrorMessage('Error al crear el producto');
          }
        },
        complete: () => {
          console.log("Done");
        }
      })
    }
  }

  resetForm(): void {
    this.formCreate.reset();
  }

  validateReleaseDate(control: any): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate < currentDate) {
      return { 'invalidReleaseDate': true };
    }

    return null;
  }

  calculateRevisionDate(): void {
    const releaseDateValue = this.formCreate.get('date_release')?.value;

    const releaseDate = new Date(releaseDateValue);
    const revisionDate = new Date(releaseDate);
    revisionDate.setFullYear(revisionDate.getFullYear() + 1);

    this.formCreate.get('date_revision')?.setValue(revisionDate.toISOString().split('T')[0]);
    this.formCreate.get('revisionDate')?.setValue(revisionDate.toISOString().split('T')[0]);
    this.formCreate.get('revisionDate')?.disable();
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
