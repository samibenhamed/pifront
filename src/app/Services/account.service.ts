import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { undetailedAccount } from '../Classes/Account-Undetailed/undetailedAccount';
import { AccountPersonalDetails } from '../Classes/Account-personalDetails/account-personal-details';
import { UserPersonalDetails } from '../Classes/Account-personalDetails/user-personal-details';
import { Image } from '../Classes/Image/image';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseURL = "http://localhost:8080/PI/OLTP/API/" ; 

  constructor(private httpClient:HttpClient) { }

  emailIsUnique(email:any):Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseURL+"unique-email/"+email)
  }

  passWordIsUnique(passWord:any):Observable<boolean>{
    return this.httpClient.get<boolean>(this.baseURL+"unique-password/"+passWord) ; 
  }

  getAllAccounts():Observable<undetailedAccount[]> {
    return this.httpClient.get<undetailedAccount[]>(this.baseURL+"get-all-accounts") ; 
  }

  getPersonalAccountDetails(accountId:number) : Observable<UserPersonalDetails> {
   return this.httpClient.get<UserPersonalDetails> (this.baseURL+"get-personal-account-details/"+accountId);
  }

  updateImage(accointId:number , imageFile:FormData):Observable<Image>{
    return this.httpClient.put<Image>(this.baseURL+"update-image/"+accointId , imageFile ) ; 

  }
  deleteImage(accountId:number):any{

    return this.httpClient.delete(this.baseURL+"delete-image/"+accountId)
  }


}
