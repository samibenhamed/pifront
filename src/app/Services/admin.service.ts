import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateAdminAccountResponse } from '../Classes/update-account/response/update-admin-account-response';
import { UpdateAdminAccountRequest } from '../Classes/update-account/request/update-admin-account-request';
@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private httpClient:HttpClient) {

  }
  baseURL = "http://localhost:8080/PI/OLTP/API/" ; 
 // 

  getAdminUniversity( id:number) : Observable<{adminUniversity:string}>{
   return this.httpClient.get<{adminUniversity:string}>("http://localhost:8080/PI/OLTP/API/get-admin-university/"+id);
  }


  addAdmin(form :FormData){

   return this.httpClient.post(this.baseURL+"add-admin" , form) ; 
  }

  addUser(form :FormData){

    return this.httpClient.post(this.baseURL+"add-user" , form) ; 
   }
   updateAccount( accountId:number , data : UpdateAdminAccountRequest ):Observable<UpdateAdminAccountResponse> {
    return this.httpClient.put<UpdateAdminAccountResponse>(this.baseURL+"update-admin-account/"+accountId , data ) ; 
  }

  deleteAccount(accountId:number):any {
    return this.httpClient.delete(this.baseURL+"delete-account/"+accountId)

  }

   
}

