import { Component, OnInit } from '@angular/core';
import { Localisation } from '../../Classes/Location/localisation';
import { LocationService } from '../../Services/location.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { AddDiplomaRequest } from '../../Classes/diploma/add-diploma-request';
import { UserService } from '../../Services/user.service';
@Component({
  selector: 'app-add-diploma',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './add-diploma.component.html',
  styleUrl: './add-diploma.component.css'
})
export class AddDiplomaComponent implements OnInit{
 userId!:number ;
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


 constructor( private locationService:LocationService , private formBuilder:FormBuilder , private userService:UserService){}
  
 ngOnInit(): void {
   this.userId= Number(localStorage.getItem('userId'))

  //  
  this.locationService.getAllLocations().subscribe(result=>{
    this.locations =result ; 
  })
 }

 isSubmited=false ; 
 onSubmit():void{
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

    this.userService.addDiploma(this.userId ,request).subscribe(result=>{
      console.log(result) ; 
      alert('diplôme ajouté avec succès !'); 
      window.location.reload()
    })
  }

 }

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
