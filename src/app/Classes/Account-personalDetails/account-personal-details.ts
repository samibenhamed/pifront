import { Image } from "../Image/image";
import { Localisation } from "../Location/localisation";

export class AccountPersonalDetails {
    dtype!:string ; 
    id!:number ; 
    firstName !:string;
    lastName !:string;
    email !:string;
    passWord !:string;
    university!:string ;
    birthDate!:any  ;
    sex!:string ;
    phone!:string ;
    title!:string ;
    description!:string ;
    linkedinURL!:string ;
    personalWesiteURL!:string ;
    protfolioURL!:string ;
    origine?:Localisation  ;
    image?:Image ;
}