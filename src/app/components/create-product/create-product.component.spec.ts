import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateProductComponent } from './create-product.component';
import { ProductsService } from 'src/app/services/products.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from 'src/app/layouts/header/header.component';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductsService', ['createFinancialProduct']);

    TestBed.configureTestingModule({
      declarations: [CreateProductComponent, HeaderComponent],
      imports: [ReactiveFormsModule, HttpClientModule, FormsModule],
      providers: [
        { provide: ProductsService, useValue: spy },
      ],
    });

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
  });

  it('should initialize the form', () => {
    component.buildForm();
    expect(component.formCreate).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createFinancialProduct on form submission', () => {
    component.formCreate = new FormGroup({
      id: new FormControl('123'),
      name: new FormControl('Test Product'),
      description: new FormControl('Test Description'),
      logo: new FormControl('Test Logo'),
      date_release: new FormControl(new Date('2023-12-30')),
      date_revision: new FormControl(new Date('2023-12-30'))
    });

    productsServiceSpy.createFinancialProduct.and.returnValue(of({}));
    component.submitForm();
    expect(productsServiceSpy.createFinancialProduct).toHaveBeenCalled();
  });

  it('should reset the form on resetForm call', () => {
    component.formCreate = new FormGroup({
      id: new FormControl('123'),
      name: new FormControl('Test Product'),
      description: new FormControl('Test Description'),
      logo: new FormControl('Test Logo'),
      date_release: new FormControl(new Date('2023-12-30')),
      date_revision: new FormControl(new Date('2023-12-30'))
    });

    component.resetForm();

    expect(component.formCreate.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
  });

  it('should validate release date correctly', () => {
    const control = { value: '2023-12-31' };

    const result = component.validateReleaseDate(control);

    expect(result).toBeNull();
  });
});
