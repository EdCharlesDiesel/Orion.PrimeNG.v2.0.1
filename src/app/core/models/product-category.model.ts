import {ProductSubcategory} from "./product-subcategory.model";

export class ProductCategory  {
  productCategoryID!: number;
  name!: string;
  modifiedDate!: Date;
  productSubcategories?: ProductSubcategory[] | undefined;
}

export interface IProductCategory {
  productCategoryID: number;
  name: string;
  modifiedDate: Date;
  productSubcategories?: ProductSubcategory[] | undefined;
}
