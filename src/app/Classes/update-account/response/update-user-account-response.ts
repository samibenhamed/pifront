import { UpdateAccountResponse } from "./update-account-response";

export class UpdateUserAccountResponse extends UpdateAccountResponse{
    promotion!:any ; 
    graduationDate!:any ; 
    satisfactionLevel!:number;
    bacType!:string ;
}