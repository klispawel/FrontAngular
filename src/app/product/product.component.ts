import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { ProductPage } from '../productpage';
import { CashRate } from '../CashRate';
import { Injectable } from '@angular/core';


declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  dataSaved = false;
  productForm: any;
  allProducts!: Observable<Product[]>;
  productPage!: Observable<ProductPage>;
  cashRate!: CashRate;
  pageIndex!: number;
  pageCount!: number;
  pageSize!: number;
  errorMessage!:string;
  productIdUpdate:any;
  message:any;
  isDataLoaded: boolean = false;
  csvContent!: string;

  constructor(private formbulider: FormBuilder, private productService: ProductService) { }

  

  ngOnInit(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.loadAllProducts();  

    this.productForm = this.formbulider.group({
      Name: ['', [Validators.required]],
      Code: ['', [Validators.required]],
      Price: ['', [Validators.required]],
    });

  }

  setData() {
    this.allProducts = this.productPage.pipe(map(pp => pp.products));
    this.productPage.pipe(map(pp => this.pageIndex = pp.pageIndex));
    this.productPage.pipe(map(pp => this.pageCount = pp.pageCount));

    this.productPage.subscribe(res => { this.pageIndex = res.pageIndex });
    this.productPage.subscribe(res => { this.pageCount = res.pageCount });
    this.productPage.subscribe(res => { this.cashRate = res.cashRate });
    this.errorMessage = "";
    this.isDataLoaded = true;
  }

  loadAllProducts() {

    this.productPage = this.productService.getAllProductsPagination(this.pageIndex, this.pageSize);
    this.setData();
   
  }
  searchProduct(phrase: string) {

    if (phrase == '' || phrase == null) {
      return this.loadAllProducts();
    }

    this.productPage = this.productService.searchProducts(this.pageSize, phrase);

    this.setData();
  }
  previousPage() {
    this.pageIndex -= 1;
    if (this.pageIndex < 1)
      this.pageIndex = 1;
    this.loadAllProducts();
  }
  nextPage() {
    this.pageIndex += 1;
    if (this.pageIndex > this.pageCount)
      this.pageIndex = this.pageCount;
    this.loadAllProducts();
  }
  onChange(newValue:any)
  {
    this.pageSize = newValue.target.value;
    this.loadAllProducts();
  }

  onFormSubmit() {
    this.dataSaved = false;
    const product = this.productForm.value;
    this.CreateProduct(product);
    this.productForm.reset();
  }

  getProductReport() {

    var x = this.productService.getProductReport().subscribe(data => {
      this.csvContent = data;
    });;

    var filename = "file.csv";
    this.csvContent = this.csvContent.replace('\r\n', '\n');
    const blob = new Blob([this.csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  
  }

  loadproductToEdit(productId: string) {

    this.errorMessage = "";

    this.productService.getProductById(productId).subscribe(product => {
      this.message = null;
      this.dataSaved = false;
      this.productIdUpdate = product.id;
      this.productForm.controls['Name'].setValue(product.name);
      this.productForm.controls['Code'].setValue(product.code);
      this.productForm.controls['Price'].setValue(product.price);
    }, (error) => {
      console.error(error);
      this.errorMessage = error;
    }
    );
  }
  CreateProduct(product: Product) {
    this.errorMessage = "";
    if (this.productIdUpdate == null) {
      this.productService.createProduct(product).subscribe(
        () => {
          this.dataSaved = true;
          this.message = 'Sukces - zapisano dane';
          this.loadAllProducts();
          this.productIdUpdate = null;
          this.productForm.reset();
        }, (error) => {
          console.error(error);
          this.errorMessage = error;
        }
      );
    } else {
      product.id = this.productIdUpdate;
      this.productService.updateProduct(product).subscribe(() => {
        this.dataSaved = true;
        this.message = 'Sukces - zapisano zmiany';
        this.loadAllProducts();
        this.productIdUpdate = null;
        this.productForm.reset();
      }, (error) => {
        console.error(error);
        this.errorMessage = error;
      }
      );
    }
  }
  deleteproduct(productId: any) {
    this.errorMessage = "";
    if (confirm("Czy na pewno chcesz usunąć dane ?")) {
      this.productService.deleteProductById(productId).subscribe(() => {
        this.dataSaved = true;
        this.message = 'Sukces - usunięto dane';
        this.loadAllProducts();
        this.productIdUpdate = null;
        this.productForm.reset();
      }, (error) => {
        console.error(error);
        this.errorMessage = error;
      }
      );
    }
  }

  resetForm() {
    this.productForm.reset();
    this.message = null;
    this.dataSaved = false;
  }
}
