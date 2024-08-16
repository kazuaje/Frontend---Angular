import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ProductService } from '../services/product.service';
import { addYears, isAfter, isEqual, startOfDay } from 'date-fns';
import { catchError, map, Observable, of } from 'rxjs';

export function validateExistingId(
  productService: ProductService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    const id = control.value;

    if (!id) {
      return of(null); // Si el campo está vacío, no validamos
    }

    return productService.verifyProductId(id).pipe(
      map((isExisting) => (isExisting ? { existingId: true } : null)),
      catchError(() => of(null)) // Maneja errores si es necesario
    );
  };
}

export function validateReleaseDate(): ValidatorFn {
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

export function validateReviewDate(
  releaseDateControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.parent) {
      return null;
    }

    const releaseDateControl = control.parent.get(releaseDateControlName);
    if (!releaseDateControl || !releaseDateControl.value) {
      return null;
    }

    const releaseDate = startOfDay(releaseDateControl.value);
    const revisionDate = startOfDay(control.value);

    const oneYearAfterRelease = addYears(releaseDate, 1);
    if (isEqual(oneYearAfterRelease, revisionDate)) {
      return null;
    } else {
      return { notOneYearAfter: true };
    }
  };
}
