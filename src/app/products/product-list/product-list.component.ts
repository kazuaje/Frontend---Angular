import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  displayModal: boolean = false; // Controlar la visibilidad del modal
  selectedProduct: Product | null = null; // Producto seleccionado para eliminación

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.updateDisplayedProducts();
      },
      error: (error) => console.error('Error loading products', error)
    });
  }

  onDeleteConfirm(product: Product) {
    this.selectedProduct = product;
    this.displayModal = true;
  }

  onDelete() {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.displayModal = false;
          this.selectedProduct = null;
          this.ngOnInit(); // Reload products
        },
        error: (error) => console.error('Error deleting product', error)
      });
    }
  }

  onCancel() {
    this.displayModal = false;
    this.selectedProduct = null;
  }

  updateDisplayedProducts() {
    this.filteredProducts = this.products.filter(product =>
      this.searchTerm ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true
    ).slice(0, this.displayCount);
  }
}
