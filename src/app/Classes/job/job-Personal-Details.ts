import { Localisation } from "../Location/localisation";

export class JobPersonalDetails {
    id!:number ; 
    companyName !:string  
    companyWebsiteURL !:string  
    companySector !:string   
    jobField  !:string  
    jobTitle !:string  
    hireDate !:any 
    quitDate !: any
    salary !:number 
    salaryCurrency !:string  
    nbApplications !:number
    nbRefusedApplications !:number
    companyLocation   !:Localisation
}