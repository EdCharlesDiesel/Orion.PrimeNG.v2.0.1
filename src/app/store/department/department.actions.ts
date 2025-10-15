import { createAction, props } from '@ngrx/store';
import {Department} from '../../core/models/department.model'


export const loadDepartments = createAction('[Department Page] Load Department');

export const loadDepartmentsSuccess  = createAction('[Department API] Load Department Successful',
    props<{ departments: Department }>()
);

export const loadDepartmentsFailure = createAction('[Department API] Load Department Failure',
    props<{ error: Error }>()
);

export const createDepartment = createAction('[Department ] Create Department',
    props<{ department: Department }>()
);

export const createDepartmentSuccess = createAction('[Department API] Create Department Success',
    props<{ department: Department }>()
);

export const createDepartmentFailure = createAction('[Department API] Create Department Failure',
    props<{ error: string }>()
);

export const updateDepartment = createAction(
    '[Departments Page] Update Department Quantity',
    props<{ DepartmentID: number; department: Department }>()
);

export const updateDepartmentSuccess = createAction(
    '[Department API] Update Department Success',
    props<{ DepartmentID: number; department: Department }>()
);

export const updateDepartmentFailure = createAction(
    '[Department API] Update Department Failure',
    props<{ error: string }>()
);

export const deleteDepartment = createAction(
    '[Departments Page] Delete Department',
    props<{ DepartmentID: number }>()
);

export const deleteDepartmentSuccess = createAction(
    '[Departments API] Delete Department Success',
    props<{ DepartmentID: number }>()
);

export const deleteDepartmentFailure = createAction(
    '[Departments API] Delete Department Failure',
    props<{ error: string }>()
);

