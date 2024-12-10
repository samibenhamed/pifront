import { UpdateAccountRequest } from "./update-account-request";

export class UpdateUserAccountRequest extends UpdateAccountRequest{
    promotion!:any ; 
    graduationDate!:any ; 
    satisfactionLevel!:number;
    bacType!:string ;
}