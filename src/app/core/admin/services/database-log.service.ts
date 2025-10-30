import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { DatabaseLogModel } from '../../models/database-log.model';


@Injectable({
  providedIn: 'root'
})
export class DatabaseLogService {
  private apiUrl = 'http://localhost:9006/api/DatabaseLog';

  constructor(private http: HttpClient) {
  }

  //TODO: Need to fix Not recommended hence I need to start using Guid to begin with.
  private tempId = 55;

  createDatabaseLog(data: DatabaseLogModel): Observable<DatabaseLogModel> {
    data.databaseLogID = ++this.tempId; // negative IDs as temp placeholders
    return this.http.post<DatabaseLogModel>(this.apiUrl, data);
  }

  getDatabaseLog(): Observable<DatabaseLogModel[]> {
    return this.http.get<DatabaseLogModel[]>(this.apiUrl);
  }

  getDatabaseLogById(id: number): Observable<DatabaseLogModel> {
    return this.http.get<DatabaseLogModel>(`${this.apiUrl}/${id}`);
  }


  updateDatabaseLog(id: number, data: DatabaseLogModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteDatabaseLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
