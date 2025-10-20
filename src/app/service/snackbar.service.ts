import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(public snackBar: MessageService) { }

  showSnackBar(message: string) {
    // this.snackBar.Add(message);
  }


}
