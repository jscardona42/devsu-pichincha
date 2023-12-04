import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  formEdit: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.buildForm();
    const product = this.sharedDataService.getProductData();
    if (product === undefined) {
      this.router.navigate(['/products']);
    }

    const dateRelease = this.datePipe.transform(new Date(product.date_release), 'yyyy-MM-dd');
    const dateRevision = this.datePipe.transform(new Date(product.date_release), 'yyyy-MM-dd');

    this.formEdit.patchValue({
      id: product.id,
      id_hidden: product.id,
      name: product.name,
      logo: product.logo,
      description: product.description,
      date_release: dateRelease,
      revisionDate: dateRevision,
      date_revision: dateRevision
    });
  }

  buildForm(): void {
    this.formEdit = this.fb.group({
      id: [{ value: '', disabled: true }],
      id_hidden: [''],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.validateReleaseDate.bind(this)]],
      revisionDate: [{ value: '', disabled: true }],
      date_revision: ['']
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.substring(0, isoString.length - 1);
  }

  submitForm(): void {
    if (this.formEdit.valid) {
      this.formEdit.value.id = this.formEdit.value.id_hidden;
      delete this.formEdit.value.id_hidden;

      this.productsService.editFinancialProduct(this.formEdit.value).subscribe({
        next: (response) => {
          this.showSuccessMessage('Producto actualizado correctamente');
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error', error);
          if (error.status === 400) {
            console.log(error);
          } else {
            this.showErrorMessage('Error al actualizar el producto');
          }
        },
        complete: () => {
          console.log("Done");
        }
      })
    }
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
    const releaseDateValue = this.formEdit.get('date_release')?.value;

    const releaseDate = new Date(releaseDateValue);
    const revisionDate = new Date(releaseDate);
    revisionDate.setFullYear(revisionDate.getFullYear() + 1);

    this.formEdit.get('date_revision')?.setValue(revisionDate.toISOString().split('T')[0]);
    this.formEdit.get('revisionDate')?.setValue(revisionDate.toISOString().split('T')[0]);
    this.formEdit.get('revisionDate')?.disable();
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
