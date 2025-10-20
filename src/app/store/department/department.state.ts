import { Department } from '../../core/models/department.model';

export interface DepartmentState {
    departments: Department[];
    isLoading: boolean;
    error: string | null;
}

export const initialDepartmentState: DepartmentState = {
    departments: [],
    isLoading: false,
    error: null
};
