import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductsRoutingModule } from './products-routing.module';

@NgModule({
  declarations: [
    ProductFormComponent,
    ProductListComponent,
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ],
  exports: [
    ProductFormComponent,
    ProductListComponent
  ]
})
export class ProductsModule { }

