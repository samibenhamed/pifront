import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../Services/user.service';
import { Diploma } from '../../Classes/diploma/diploma';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddDiplomaRequest } from '../../Classes/diploma/add-diploma-request';
import { Localisation } from '../../Classes/Location/localisation';
import { LocationService } from '../../Services/location.service';

@Component({
  selector: 'app-update-diploma',
  standalone: true,
  imports: [HeaderComponent , ReactiveFormsModule] ,
  templateUrl: './update-diploma.component.html',
  styleUrl: './update-diploma.component.css'
})
export class UpdateDiplomaComponent implements OnInit {
  diplomaId!:number ; 
  diploma!:Diploma; 
  locations:Localisation[]=[] ; 

 addDiplomaFormGroup = this.formBuilder.group({
  universityLocationId : ['' , Validators.required ] , 
  universityName : ['' , Validators.required ] , 
  studyField :  ['' , Validators.required ] , 
  otherStudyField :  ['' , Validators.required ] ,
  diplomaType :  ['' , Validators.required ] , 
  enrollmenDate :  ['' , Validators.required ] , 
  graduationDate :  [''  ]  

 
})

  constructor (private activatedRoute:ActivatedRoute ,  private userService:UserService ,   private locationService:LocationService ,  private formBuilder:FormBuilder  ){}
  
  ngOnInit(): void {
    this.diplomaId = Number(this.activatedRoute.snapshot.paramMap.get('diplomaId') )  ; 
    // Get Current Diploma Details 
    this.userService.getDiplomaById(this.diplomaId).subscribe(result=>{
      this.diploma =result ; 

      this.addDiplomaFormGroup.get('universityLocationId')?.setValue(String(this.diploma.universityLocation.id)) ; 
      this.addDiplomaFormGroup.get('universityName')?.setValue( this.diploma.universityName  ) ; 
      const domains =   [ "Data Science" , "Business Analytics"  , "Business Intelligence" , "software developments"  , "DevOps" , "Cloud/BigData"  , "Cyber Security" , "Digital Management & Information Systems - MDSI" ]
      if ( domains.indexOf(this.diploma.studyField ) == -1 ){
      this.addDiplomaFormGroup.get('studyField')?.setValue( "Autre") ;
      this.addDiplomaFormGroup.get('otherStudyField')?.setValue( this.diploma.studyField ) ;
      }
      else {
      this.addDiplomaFormGroup.get('studyField')?.setValue( this.diploma.studyField ) ;
      }
      this.addDiplomaFormGroup.get('diplomaType')?.setValue( this.diploma.diplomaType ) ;
      this.addDiplomaFormGroup.get('enrollmenDate')?.setValue( this.diploma.enrollmenDate ) ;
      this.addDiplomaFormGroup.get('graduationDate')?.setValue( this.diploma.graduationDate ) ;    
    })

    // Get Locations To Display In Form ; 
    this.locationService.getAllLocations().subscribe(result=>{
      this.locations =result ; 
      console.log(result) ; 
    })
  }



isSubmited=false ; 
onSubmit(){
  this.isSubmited=true ; 
  if(this.formIsValid()){
    const request = new AddDiplomaRequest() ;
    //
    if(this.addDiplomaFormGroup.get('studyField')?.value =='Autre' ){
      request.studyField = String (this.addDiplomaFormGroup.get('otherStudyField')?.value  ) ; 
    } 
    else {
      request.studyField = String (this.addDiplomaFormGroup.get('studyField')?.value )  ;  
    }

    request.universityLocationId = Number (this.addDiplomaFormGroup.get('universityLocationId')?.value ) ; 
    request.universityName = String (this.addDiplomaFormGroup.get('universityName')?.value ) ; 
    request.diplomaType = String (this.addDiplomaFormGroup.get('diplomaType')?.value ) ; 
    request.enrollmenDate =  this.addDiplomaFormGroup.get('enrollmenDate')?.value   ; 
    request.graduationDate =  this.addDiplomaFormGroup.get('graduationDate')?.value ;

    this.userService.updateDiploma(this.diplomaId ,request).subscribe(result=>{
      console.log(result) ; 
      alert('diplôme mis à jour avec succès !'); 
      window.location.reload()
    })
  }




}


  // 

  // Input Control 
  hasRequiredError(formControlName:string):boolean {
    if(this.addDiplomaFormGroup.get(formControlName )?.hasError('required') &&
       ( this.addDiplomaFormGroup.get(formControlName)?.touched || this.addDiplomaFormGroup.get(formControlName)?.dirty || this.isSubmited ) 
    ){
      return true ; 
    }
    else { return false ;  }
   }
  
  
   invalidStudyField():boolean{
    if ((this.hasRequiredError('otherStudyField') && this.addDiplomaFormGroup.get('studyField')?.value =='Autre' ) || this.hasRequiredError('studyField')){ 
       return true ; 
    }
    return false ; 
   }
  
   invalidGraduationDate():boolean{
    const gdate= new  Date ( String(this.addDiplomaFormGroup.get('graduationDate')?.value )     ) ;  
    const enrdate = new  Date ( String(this.addDiplomaFormGroup.get('enrollmenDate')?.value )     ) ;  
  
    if (   gdate < enrdate ){
      return true ; 
    }
    else {
      return false ; 
    }
  
   }
  
   formIsValid():boolean{
   if( !this.invalidGraduationDate() && !this.invalidStudyField() &&
        this.addDiplomaFormGroup.get('universityLocationId')?.valid  &&
        this.addDiplomaFormGroup.get('universityName')?.valid  &&
        this.addDiplomaFormGroup.get('diplomaType')?.valid  &&
        this.addDiplomaFormGroup.get('enrollmenDate')?.valid  
      ){
        return true ; 
   }else {return false ; }
   }





}
