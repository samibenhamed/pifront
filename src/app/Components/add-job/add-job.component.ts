import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { Localisation } from '../../Classes/Location/localisation';
import { LocationService } from '../../Services/location.service';
import { NewJobRequest } from '../../Classes/job/new-job-request';
import { UserService } from '../../Services/user.service';
@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [HeaderComponent , ReactiveFormsModule ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css'
})
export class AddJobComponent implements OnInit {
  userId!:number ; 
  // 
  locations:Localisation[]=[] ; 
 
  // Request :

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
    salaryCurrency : [''    ] ,
    nbApplications : ['' , [Validators.required   ,  Validators.min(0)] ]  ,
    nbRefusedApplications : ['' , [Validators.required , Validators.min(0)] ] ,
    companyLocationId : ['' , [Validators.required] ] 
  });
  // 

  constructor(private formBuilder:FormBuilder , private locationService:LocationService , private userServie:UserService ){}

  ngOnInit(): void {
    // Get User Id 
    this.userId = Number(localStorage.getItem('userId')) ;
    
    // Popilate Locations Array 
     this.locationService.getAllLocations().subscribe(result=>{
      this.locations= result ; 
      console.log (this.locations ) ; 
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
    this.userServie.addJob(this.userId,request).subscribe(result=>{
      console.log(result) ; 
      alert(' expérience ajoutée avec succès') ; 
      window.location.reload() ;
    });
    }




  }

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
