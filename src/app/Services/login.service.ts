import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../Classes/Login/loginRequest';
import { LoginResponse } from '../Classes/Login/loginResponse';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient:HttpClient) {

  }

  checkLogins(data :LoginRequest):Observable<LoginResponse>{
   return this.httpClient.post<LoginResponse>("http://localhost:8080/PI/OLTP/API/login",data);
  }

  change_userId_userType(data : LoginResponse){
   localStorage.setItem("userType",data.dtype) ;
   localStorage.setItem("userId",data.id.toString())
  }
  
  logOut():void{
   localStorage.clear();
  }
}
