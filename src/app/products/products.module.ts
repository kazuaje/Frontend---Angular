// src/app/products/products.module.ts (si tienes un módulo dedicado para productos)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductFormComponent } from './product-form/product-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    ProductFormComponent,
    ProductListComponent,
    // Otros componentes
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    DialogModule,
    ButtonModule
  ],
  exports: [
    ProductFormComponent,
    ProductListComponent,
    // Otros componentes que necesitas exportar
  ]
})
export class ProductsModule { }

