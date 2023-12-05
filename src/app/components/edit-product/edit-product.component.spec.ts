import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './edit-product.component';
import { ProductsService } from 'src/app/services/products.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from 'src/app/layouts/header/header.component';
import { DatePipe } from '@angular/common';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let datePipe: DatePipe;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductsService', ['editFinancialProduct']);

    TestBed.configureTestingModule({
      declarations: [EditProductComponent, HeaderComponent],
      imports: [ReactiveFormsModule, HttpClientModule, FormsModule],
      providers: [
        DatePipe,
        { provide: ProductsService, useValue: spy },
      ],
    });

    fixture = TestBed.createComponent(EditProductComponent);
    datePipe = TestBed.inject(DatePipe);
    component = fixture.componentInstance;
    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
  });

  it('should initialize the form', () => {
    component.buildForm();
    expect(component.formEdit).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call editFinancialProduct on form submission', () => {
    component.formEdit = new FormGroup({
      id: new FormControl('123'),
      name: new FormControl('Test Product'),
      description: new FormControl('Test Description'),
      logo: new FormControl('Test Logo'),
      date_release: new FormControl(new Date('2023-12-30')),
      date_revision: new FormControl(new Date('2023-12-30'))
    });

    productsServiceSpy.editFinancialProduct.and.returnValue(of({}));
    component.submitForm();
    expect(productsServiceSpy.editFinancialProduct).toHaveBeenCalled();
  });

  it('should validate release date correctly', () => {
    const control = { value: '2023-12-31' };

    const result = component.validateReleaseDate(control);

    expect(result).toBeNull();
  });
});
