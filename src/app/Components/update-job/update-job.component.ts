import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { Localisation } from '../../Classes/Location/localisation';
import { LocationService } from '../../Services/location.service';
import { NewJobRequest } from '../../Classes/job/new-job-request';
import { UserService } from '../../Services/user.service';
import { JobPersonalDetails } from '../../Classes/job/job-Personal-Details';

@Component({
  selector: 'app-update-job',
  standalone: true,
  imports: [HeaderComponent ,ReactiveFormsModule  ],
  templateUrl: './update-job.component.html',
  styleUrl: './update-job.component.css'
})
export class UpdateJobComponent implements OnInit {

  jobId!:number ; 
  locations:Localisation[]=[] ; 
  job!:JobPersonalDetails ; 

  // Form Group 
  jobForm = this.formBuilder.group({
    companyName : ['' , [Validators.required] ] , 
    companyWebsiteURL : ''  ,
    companySector : ['' , [Validators.required] ] ,
    otherCompanySector  :  ['' , [Validators.required] ] , 
    jobField : ['' , [Validators.required] ] ,
    otherJobField : ['' , [Validators.required] ] ,
    jobTitle : ['' , [Validators.required] ] ,
    hireDate : ['' , [Validators.required] ] ,
    quitDate : ''   ,
    salary : [''  ]   ,
    salaryCurrency : [''  ] ,
    nbApplications : ['' , [Validators.required   ,  Validators.min(0)] ]  ,
    nbRefusedApplications : ['' , [Validators.required , Validators.min(0)] ] ,
    companyLocationId : ['' , [Validators.required] ] 
  });
  // 
  constructor(private activateRoute:ActivatedRoute , private formBuilder:FormBuilder , private locationService:LocationService , private userServie:UserService ){}


  ngOnInit(): void {
    // 
    this.jobId = Number(this.activateRoute.snapshot.paramMap.get('jobId') ) ; 
    console.log(this.jobId) 
        
    // Locations 
    this.locationService.getAllLocations().subscribe(result=>{
    this.locations= result ; 
    console.log (this.locations ) ; 
    })
    // Selected Job
    this.userServie.getJobById(this.jobId).subscribe(result=>{
      this.job=result ; 
      const companySectors = [  "Informatique et Technologie" ,  "Santé et Sciences de la Vie" , "Ingénierie"  , "Finance et Comptabilité" ,"Énergie et Environnement"  , "Vente et Marketing" , "banque et assurance" ]
      if(companySectors.indexOf(this.job.companySector)==-1 ){
       this.jobForm.get("companySector")?.setValue("Autre") ;  
       this.jobForm.get("otherCompanySector")?.setValue(this.job.companySector ) ;  
       console.log(this.job.companySector)
      }
      else {
       this.jobForm.get("companySector")?.setValue(this.job.companySector) ;  
      }
      const jobFields  = [ "Developpement Informatique" ,"Developpement Systemes d'informations" , "Business Intelligence" , "Data Science"  , "Management"  , "Marketing Digital"  , "Cyber Security"  , "Finance et Comptabilité"  , "Relations Client"  , "Production"  ]
      if(jobFields.indexOf(this.job.jobField)==-1 ){
        this.jobForm.get("jobField")?.setValue("Autre") ;  
        this.jobForm.get("otherJobField")?.setValue(this.job.jobField ) ;  
       }
       else {
        this.jobForm.get("jobField")?.setValue(this.job.jobField) ;  
       }

         this.jobForm.get("companyName")?.setValue(this.job.companyName ) ;  
         this.jobForm.get("companyWebsiteURL")?.setValue(this.job.companyWebsiteURL ) ;  
         this.jobForm.get("companyLocationId")?.setValue( String (this.job.companyLocation.id )   ) ;  
         this.jobForm.get("jobTitle")?.setValue(this.job.jobTitle ) ;  
         this.jobForm.get("hireDate")?.setValue(this.job.hireDate ) ;  
         this.jobForm.get("quitDate")?.setValue(this.job.quitDate ) ;  
         this.jobForm.get("salary")?.setValue( String (this.job.salary) ) ; 
         this.jobForm.get("salaryCurrency")?.setValue(this.job.salaryCurrency ) ;  
         this.jobForm.get("nbApplications")?.setValue( String (this.job.nbApplications) ) ; 
         this.jobForm.get("nbRefusedApplications")?.setValue( String (this.job.nbRefusedApplications) ) ; 
    }) 


  }



  isSubmitted=false ; 
  onSubmit():void{
    this.isSubmitted =true ;
    // Check If Valid 
    if(this.formIsValid()){
      let request = new NewJobRequest(); 
      // 
      if( this.jobForm.get('jobField')?.value =="Autre" ){
        request.jobField= String(this.jobForm.get('otherJobField')?.value ) ;  
      }else{
        request.jobField= String(this.jobForm.get('jobField')?.value ) ;  
      }
      // 
      if( this.jobForm.get('companySector')?.value =="Autre" ){
        request.companySector= String(this.jobForm.get('otherCompanySector')?.value ) ;  
      }else{
        request.companySector= String(this.jobForm.get('companySector')?.value ) ;  
      }


     request.companyName= String(this.jobForm.get('companyName')?.value ) ; 
     request.jobTitle= String(this.jobForm.get('jobTitle')?.value ) ; 


    request.companyWebsiteURL= String(this.jobForm.get('companyWebsiteURL')?.value ) ;
    request.hireDate= this.jobForm.get('hireDate')?.value   ;
    request.quitDate= this.jobForm.get('quitDate')?.value   ; 
    request.salary= Number(this.jobForm.get('salary')?.value ) ; 
    request.salaryCurrency= String(this.jobForm.get('salaryCurrency')?.value ) ;
    request.nbApplications= Number(this.jobForm.get('nbApplications')?.value ) ; 
    request.nbRefusedApplications= Number(this.jobForm.get('nbRefusedApplications')?.value ) ; 
    request.companyLocationId= Number(this.jobForm.get('companyLocationId')?.value ) ; 

    this.userServie.updateJob(this.jobId ,request).subscribe(result=>{
      console.log(result) ; 
      alert('travail mis à jour avec succès ! ')
    })
    
    }




  }



// IputControls 
hasRequiredError(formControlName:string ):boolean {
  if(this.jobForm.get(formControlName)?.hasError('required')  && (this.jobForm.get(formControlName)?.touched || this.jobForm.get(formControlName)?.dirty || this.isSubmitted ) ){
     return true ; 
  }
  return false 
}

hasMinError(formControlName:string):boolean{

  if(this.jobForm.get(formControlName)?.hasError('min')  && (this.jobForm.get(formControlName)?.touched || this.jobForm.get(formControlName)?.dirty || this.isSubmitted ) ){
    return true ; 
 }
 return false   }
invalidCompanySector():boolean{

  if( ( this.jobForm.get('companySector')?.value=="Autre" && this.hasRequiredError('otherCompanySector')  ) || this.hasRequiredError('companySector') ){
    return true ; 
  }

  return false ; 
}


invalidJobField():boolean{
  if( ( this.jobForm.get('jobField')?.value=="Autre" && this.hasRequiredError('otherJobField')  ) || this.hasRequiredError('jobField') ){
    return true ; 
  }
  return false ; 
}

invalidQuitDate():boolean{
  if(this.jobForm.get('quitDate')?.value ){
    const qd= new  Date( String(this.jobForm.get('quitDate')?.value))
    const hd = new  Date( String(this.jobForm.get('hireDate')?.value))
    if(hd>qd){
      return true ; 

    }

  }
  return false  ; 
}
formIsValid():boolean{
  if(     
    !this.invalidCompanySector() && 
  !this.invalidJobField()
  && this.jobForm.get('companyName')?.valid &&
  this.jobForm.get('companyWebsiteURL')?.valid &&
   this.jobForm.get('jobTitle')?.valid &&
   this.jobForm.get('hireDate')?.valid &&
   this.jobForm.get('quitDate')?.valid &&
   this.jobForm.get('salary')?.valid &&
   this.jobForm.get('salaryCurrency')?.valid &&
   this.jobForm.get('nbApplications')?.valid &&
   this.jobForm.get('nbRefusedApplications')?.valid &&
   this.jobForm.get('companyLocationId')?.valid  &&
   !this.invalidQuitDate() 

  ){
    return true ; 
  }

  return false ; 
}



}
