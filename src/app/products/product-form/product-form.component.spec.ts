import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceMock: any;
  let router: Router;

  const activatedRouteStub = {
    paramMap: of(new Map([['id', '123']]))
  };

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn(() => of({ data: [{ id: '123', name: 'Test Product', logo: 'user.png', description: 'Texto para la descripcion', date_release: '2024-01-01', date_revision: '2024-01-01' }] })),
      updateProduct: jest.fn(),
      addProduct: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      declarations: [ProductFormComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product data if in edit mode', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.productForm.value.name).toEqual('Test Product');
  });

  it('should reset the form', () => {
    component.resetForm();
    expect(component.productForm.pristine).toBeTruthy();
  });

  it('should submit form and add new product', () => {
    component.isEditMode = false;
    component.onSubmit();
    expect(productServiceMock.addProduct).toHaveBeenCalled();
  });

  it('should submit form and update product', () => {
    component.isEditMode = true;
    component.onSubmit();
    expect(productServiceMock.updateProduct).toHaveBeenCalled();
  });
});
