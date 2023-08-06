import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IContact } from '../models/contact-model';
import { IGroup } from '../models/group';
import { ApiResponse } from '../models/response';

export type ContactResponse = IContact[];

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  _baseURl = "http://localhost:4000";

  getContacts(params: any): Observable<ContactResponse> {
    return this._httpClient.get<ContactResponse>(`${this._baseURl}/contacts`, { params:params }).pipe(catchError(this.handleError));
  }

  getContact(id: string): Observable<IContact> {
    return this._httpClient.get<IContact>(`${this._baseURl}/contacts/${id}`).pipe(catchError(this.handleError));
  }

  createContact(body: IContact): Observable<IContact> {
    return this._httpClient.post<IContact>(`${this._baseURl}/contacts`, body).pipe(catchError(this.handleError));
  }

  updateContact(id: string, body: IContact): Observable<any> {
    return this._httpClient.patch<IContact>(`${this._baseURl}/contacts/${id}`, body).pipe(catchError(this.handleError));
  }

  recycleContact(id: string, params: any): Observable<any> {
    return this._httpClient.patch<IContact>(`${this._baseURl}/contacts/${id}`, params).pipe(catchError(this.handleError));
  }

  deleteContact(id: string): Observable<IContact> {
    return this._httpClient.delete<IContact>(`${this._baseURl}/contacts/${id}`).pipe(catchError(this.handleError));
  }

  getAllGroups(): Observable<IGroup> {
    return this._httpClient.get<IGroup>(`${this._baseURl}/groups`).pipe(catchError(this.handleError));
  }

  getGroup(contact: IContact): Observable<IGroup> {
    return this._httpClient.get<IGroup>(`${this._baseURl}/groups/${contact.groupId}`).pipe(catchError(this.handleError));
  }

  uploadMedia(_event: any, imageId: string = ''): Observable<any> {
    console.log(imageId);
    const file = _event;
    const fd = new FormData();
    // fd.append('for',imageId);
    // fd.append('tags', 'vehicle');     //Todo: to be given as params acoording to tagtype
    fd.append('media', file, file.name);

    return this._httpClient.post<ApiResponse<any>>(`${this._baseURl}/media`, fd)
      .pipe(
        map((res: any) => {
          return res.data.s3Path;
        }));
  }



  public handleError(error: HttpErrorResponse) {
    let errorMessage: string = ''
    if (error.error instanceof ErrorEvent) {
      //client side
      errorMessage = `Error : ${error.error.message}`;
    } else {
      //server Side
      errorMessage = `Status: ${error.status} \n Message: ${error.message}`;
    }

    return throwError(errorMessage);
  }

}
