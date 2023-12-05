import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from 'src/app/services/products.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from 'src/app/layouts/header/header.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductsService', ['getFinancialProducts', 'deleteFinancialProduct']);

    TestBed.configureTestingModule({
      declarations: [ProductsComponent, HeaderComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: spy },
      ],
    });

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }) as Promise<SweetAlertResult<unknown>>);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFinancialProducts on ngOnInit', fakeAsync(() => {
    productsServiceSpy.getFinancialProducts.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(productsServiceSpy.getFinancialProducts).toHaveBeenCalled();
  }));

  // it('should call deleteFinancialProduct when deleteProduct is called', waitForAsync(async () => {
  //   productsServiceSpy.deleteFinancialProduct.and.returnValue(of({}));

  //   component.deleteProduct();
  //   await fixture.whenStable();

  //   expect(productsServiceSpy.deleteFinancialProduct).toHaveBeenCalledWith('creaditcard');
  //   expect(Swal.fire).toHaveBeenCalled();
  // }));


  it('should navigate to /edit-product when editProduct is called', () => {
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.editProduct();

    expect(routerSpy).toHaveBeenCalledWith(['/edit-product']);
  });

});
