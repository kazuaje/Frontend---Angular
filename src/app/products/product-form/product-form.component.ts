import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from 'app/models/product.model';
import { addYears, isAfter, isEqual, parseISO, startOfDay } from 'date-fns';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  isEditMode = false;
  currentProductId: string | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  registerForm: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Verificando si estoy en modo edicion
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.currentProductId = id !== null ? id : undefined;
      this.registerForm = 'Registro';
      if (this.currentProductId) {
        this.isEditMode = true;
        this.registerForm = 'Edición';
        this.productService.getProducts()
          .subscribe((response) => {
            const products = response.data;
            const product = products.find(
              (p: ProductModel) => p.id === this.currentProductId
            );
            if (product) {
              this.productForm.patchValue({
                id: product.id,
                name: product.name,
                description: product.description,
                releaseDate: parseISO(product.date_release.toString()),
                reviewDate: parseISO(product.date_revision.toString()),
                logo: product.logo
              });

              if (product.logo) {
                this.imageUrl = product.logo;
              }
            }
          });
      } else {  
        this.isEditMode = false;
      }

      this.productForm = new FormGroup({
        id: new FormControl({value: '', disabled: this.isEditMode}, {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [this.validateExistingId()],
          updateOn: 'blur',
        }),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ]),
        releaseDate: new FormControl('', [
          Validators.required,
          this.validateReleaseDate(),
        ]),
        reviewDate: new FormControl('', [
          Validators.required,
          this.validateReviewDate('releaseDate'),
        ]),
        logo: new FormControl('', [Validators.required]),
      });
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

  resetForm() {
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.productForm.updateValueAndValidity();

    if (this.productForm.valid) {
      const productData: ProductModel = {
        id: this.id?.value,
        name: this.name?.value,
        description: this.description?.value,
        date_release: this.releaseDate?.value,
        date_revision: this.reviewDate?.value,
        logo: this.logo?.value
      };
      console.log(productData);
      if (this.isEditMode) {
        productData.id = this.currentProductId as string;
        this.productService
          .updateProduct(productData.id, productData)
          .subscribe({
            next: (response) => {
              console.log(response.message);
              this.router.navigate(['/products']);
            },
            error: (error) => {
              console.error('Failed to add product', error);
            },
          });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: (response) => {
            console.log(response.message);
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Failed to add product', error);
          },
        });
      }
    }
  }

  //
  // Getters
  //

  get id() {
    return this.productForm.get('id');
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get releaseDate() {
    return this.productForm.get('releaseDate');
  }

  get reviewDate() {
    return this.productForm.get('reviewDate');
  }

  get logo() {
    return this.productForm.get('logo');
  }

  //
  // Validators
  //

  validateExistingId(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      const id = control.value;

      if (!id) {
        return of(null); // Si el campo está vacío, no validamos
      }

      return this.productService.verifyProductId(id).pipe(
        map((isExisting) => (isExisting ? { existingId: true } : null)),
        catchError(() => of(null)) // Maneja errores si es necesario
      );
    };
  }

  validateReleaseDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = startOfDay(control.value);
      const today = startOfDay(new Date());

      if (isEqual(controlDate, today) || isAfter(controlDate, today)) {
        return null;
      } else {
        return { dateIsNotFuture: true };
      }
    };
  }

  validateReviewDate(releaseDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.parent) {
        return null; // Si no hay valor o el control no tiene un elemento padre, no valida
      }

      const releaseDateControl = control.parent.get(releaseDateControlName);
      if (!releaseDateControl || !releaseDateControl.value) {
        return null; // Si no hay control de fecha de liberación o valor, no valida
      }

      const releaseDate = startOfDay(releaseDateControl.value);
      const revisionDate = startOfDay(control.value);

      // Añade un año a la fecha de liberación y compara con la fecha de revisión
      const oneYearAfterRelease = addYears(releaseDate, 1);
      if (isEqual(oneYearAfterRelease, revisionDate)) {
        return null; // Las fechas coinciden exactamente un año después
      } else {
        return { notOneYearAfter: true }; // Retorna un error si no es exactamente un año después
      }
    };
  }
}
