import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeePayHistory } from '../../../models/employee-pay-history.model';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeePayHistoryService {

  private apiUrl = environment.humanResourcesBaseURL +'EmployeePayHistory';

  constructor(private http: HttpClient) {}
  //TODO: Need to fix Not recommended hence I need to start using Guid to begin with.
  private tempId = 55;
  createEmployeePayHistory(data: EmployeePayHistory): Observable<EmployeePayHistory> {
    data.businessEntityID = ++this.tempId; // negative IDs as temp placeholders
    return this.http.post<EmployeePayHistory>(this.apiUrl, data);
  }
  getEmployeePayHistory(): Observable<EmployeePayHistory[]> {
    return this.http.get<EmployeePayHistory[]>(this.apiUrl);
  }

  getEmployeePayHistoryById(id: number): Observable<EmployeePayHistory> {
    return this.http.get<EmployeePayHistory>(`${this.apiUrl}/${id}`);
  }


  updateEmployeePayHistory(id: number, data: EmployeePayHistory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteEmployeePayHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
