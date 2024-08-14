import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn(() => of({ data: [{ id: '1', name: 'Test Product' }] }))
    };

    await TestBed.configureTestingModule({
      declarations: [ ProductListComponent ],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(1);
  });

  it('should open modal on delete confirm', () => {
    component.onDeleteConfirm(component.products[0]);
    expect(component.displayModal).toBeTruthy();
    expect(component.selectedProduct).toEqual(component.products[0]);
  });

  it('should delete product and hide modal', () => {
    const deleteSpy = jest.spyOn(productServiceMock, 'deleteProduct').mockReturnValue(of({}));
    component.selectedProduct = component.products[0];
    component.onDelete();

    expect(deleteSpy).toHaveBeenCalledWith('1');
    expect(component.displayModal).toBeFalsy();
    expect(component.selectedProduct).toBeNull();
  });
});
