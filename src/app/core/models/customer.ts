import {SalesTerritory} from "./sales-territory.model";
import {SalesOrderHeader} from "./sale-order-header.model";
import {StoreModel} from "./store.model";
import { Person } from './person.model';

export class Customer {
  /** Primary key. */
  customerID!: number;
  /** Foreign key to Person.BusinessEntityID */
  personID?: number | undefined;
  /** Foreign key to Store.BusinessEntityID */
  storeID?: number | undefined;
  /** ID of the territory in which the customer is located. Foreign key to SalesTerritory.SalesTerritoryID. */
  territoryID?: number | undefined;
  /** Unique number identifying the customer assigned by the accounting system. */
  accountNumber!: string;
  /** ROWGUIDCOL number uniquely identifying the record. Used to support a merge replication sample. */
  rowguid!: string;
  /** Date and time the record was last updated. */
  modifiedDate!: Date;
  person?: Person;
  store?: StoreModel;
  salesTerritory?: SalesTerritory;
  salesOrderHeaders?: SalesOrderHeader[] | undefined;
  representative: any;

}

export interface ICustomer {
  /** Primary key. */
  customerID: number;
  /** Foreign key to Person.BusinessEntityID */
  personID?: number | undefined;
  /** Foreign key to Store.BusinessEntityID */
  storeID?: number | undefined;
  /** ID of the territory in which the customer is located. Foreign key to SalesTerritory.SalesTerritoryID. */
  territoryID?: number | undefined;
  /** Unique number identifying the customer assigned by the accounting system. */
  accountNumber: string;
  /** ROWGUIDCOL number uniquely identifying the record. Used to support a merge replication sample. */
  rowguid: string;
  /** Date and time the record was last updated. */
  modifiedDate: Date;
  person?: Person;
  store?: StoreModel;
  salesTerritory?: SalesTerritory;
  salesOrderHeaders?: SalesOrderHeader[] | undefined;
}
