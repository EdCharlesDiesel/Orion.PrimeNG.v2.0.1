
import {EmployeeDepartmentHistory} from "./employee-department-history.model ";
import {PurchaseOrderHeader} from "./purchase-order-header.model";
import {Course} from "./course.model";
import {SalesPerson} from "./sales-person.model";
import {EmployeePayHistory} from "./employee-pay-history.model";
import {JobCandidate} from "./job-candidate.model";

export class Employee {
  /** Primary key for Employee records.  Foreign key to BusinessEntity.BusinessEntityID. */
  businessEntityID!: number;
  /** Unique national identification number such as a social security number. */
  nationalIDNumber!: string;
  /** Network login. */
  loginID!: string;
  organizationNode?: string;
  /** The depth of the employee in the corporate hierarchy. */
  organizationLevel?: number | undefined;  /** Work title such as Buyer or Sales Representative. */
  jobTitle!: string;
  /** Date of birth. */
  birthDate!: Date;
  /** M = Married, S = Single */
  maritalStatus!: string;
  /** M = Male, F = Female */
  gender!: string;
  /** Employee hired on this date. */
  hireDate!: Date;
  /** Job classification. 0 = Hourly, not exempt from collective bargaining. 1 = Salaried, exempt from collective bargaining. */
  salariedFlag!: boolean;
  /** Number of available vacation hours. */
  vacationHours!: number;
  /** Number of available sick leave hours. */
  sickLeaveHours!: number;
  /** 0 = Inactive, 1 = Active */
  currentFlag!: boolean;
  /** ROWGUIDCOL number uniquely identifying the record. Used to support a merge replication sample. */
  rowguid?: string| undefined;
  /** Date and time the record was last updated. */
  modifiedDate!: Date;
  //TODO: Need to fix.
  //person?: Person;
  employeeDepartmentHistories?: EmployeeDepartmentHistory[] | undefined;
  employeePayHistories?: EmployeePayHistory[] | undefined;
  jobCandidates?: JobCandidate[] | undefined;
  documents?: Document[] | undefined;
  purchaseOrderHeaders?: PurchaseOrderHeader[] | undefined;
  salesPerson?: SalesPerson;
  jobLevel?: number;
  yearsInService?: number;
  attendedCourses?: Course[] | undefined;
  suggestedBonus?: number;
  salary?: number;
  minimumRaiseGiven?: boolean;
  id?: string;
  entityVersion?: number;
}

