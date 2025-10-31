import {Product} from "./product";
import {ProductCategory} from "./product-category.model";

export class ProductSubcategory implements IProductSubcategory {
  productSubcategoryID!: number;
  productCategoryID!: number;
  name!: string;
  modifiedDate!: Date;
  productCategory?: ProductCategory;
  products?: Product[] | undefined;
}

export interface IProductSubcategory {
  productSubcategoryID: number;
  productCategoryID: number;
  name: string;
  modifiedDate: Date;
  productCategory?: ProductCategory;
  products?: Product[] | undefined;
}
