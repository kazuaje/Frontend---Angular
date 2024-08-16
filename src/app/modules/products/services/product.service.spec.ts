import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product', () => {
    const product = { id: 1, name: 'Test Product', price: 100, description: 'Description' };
    service.addProduct(product);
    service.getProducts().subscribe(products => {
      expect(products).toContain(product);
    });
  });
});
