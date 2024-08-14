import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  currentProductId: string | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  registerForm: string = "";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      logo: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.currentProductId = id !== null ? id : undefined;
      this.registerForm = "Registro";
      if (this.currentProductId) {
        this.isEditMode = true;
        this.registerForm = "Edición";
        this.productService.getProducts().subscribe(response => {
          const products = response.data;
          const product = products.find((p: Product) => p.id === this.currentProductId);
          if (product) {
            this.productForm.patchValue(product);
            if (product.logo) {
              this.imageUrl = product.logo;
            }
          }
        });
      } else {
        this.isEditMode = false;
      }
    });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.productForm.get('logo')!.setValue(this.imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  resetForm() {
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData: Product = {
        id: this.isEditMode ? this.currentProductId : this.generateRandomId(),
        ...this.productForm.value
      };
      if (this.isEditMode) {
        this.productService.updateProduct(productData.id, productData).subscribe(() => {
          console.log('Product updated successfully');
          this.router.navigate(['/products']);
        }, error => {
          console.error('Failed to update product', error);
        });
      } else {
        this.productService.addProduct(productData).subscribe(() => {
          console.log('Product added successfully');
          this.router.navigate(['/products']);
        }, error => {
          console.error('Failed to add product', error);
        });
      }
    }
  }
}
