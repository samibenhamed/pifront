import { NewAccount } from "./NewAccount";

export class NewUser extends NewAccount {
    promotion!: any ;
    graduationDate !:any ; 
    bacType!:string  ;
    satisfactionLevel:number=0 ; 
    status !:string ;
}