import { Localisation } from "../Location/localisation";

export class Job{
    id!:number ; 
    companyName !:string  
    companyWebsiteURL !:string  
    jobTitle !:string  
    hireDate !:any 
    quitDate !: any
    companyLocation   !:Localisation
}