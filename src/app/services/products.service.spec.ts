import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../interfaces/product.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getFinancialProducts and return data', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' }
    ];

    service.getFinancialProducts().subscribe(data => {
      expect(data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should call createFinancialProduct and return data', () => {
    const mockProduct: Product = { id: '1', name: 'New Product', description: "", logo: "", date_release: new Date(), date_revision: new Date() };

    service.createFinancialProduct(mockProduct).subscribe(data => {
      expect(data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/products`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should call editFinancialProduct and return data', () => {
    const mockProduct: Product = { id: '1', name: 'New Product', description: "", logo: "", date_release: new Date(), date_revision: new Date() };

    service.editFinancialProduct(mockProduct).subscribe(data => {
      expect(data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/products`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should call deleteFinancialProduct and return data', () => {
    const productId = '1';

    service.deleteFinancialProduct(productId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
