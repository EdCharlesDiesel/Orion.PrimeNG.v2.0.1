import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Shift } from '../../../models/shift.model';



@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private apiUrl = environment.humanResourcesBaseURL +'Shift';

  constructor(private http: HttpClient) {}//localhost:9010/
  //TODO: Need to fix Not recommended hence I need to start using Guid to begin with.
  private tempId = 100;
  createShift(data: Shift): Observable<Shift> {
    data.shiftID = ++this.tempId; // negative IDs as temp placeholders
    return this.http.post<Shift>(this.apiUrl, data);
  }
  getShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  getShiftById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.apiUrl}/${id}`);
  }


  updateShift(id: number, data: Shift): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  public deleteShift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
