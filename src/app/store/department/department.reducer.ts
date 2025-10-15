import {  createReducer, on } from '@ngrx/store';
import {initialDepartmentState} from './department.state';
import * as DepartmentActions from './department.actions';

export const departmentReducer = createReducer(
    initialDepartmentState,

    // Load Departments
    on(DepartmentActions.loadDepartments, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    on(DepartmentActions.loadDepartmentsSuccess, (state,{departments}) => ({
        ...state,
        isLoading: false,
        error: null,
    })),

    on(DepartmentActions.loadDepartmentsFailure, (state, {error}) => ({
        ...state,
        isLoading: false,
        error: "error loafing departments",
    }))
    
    )
