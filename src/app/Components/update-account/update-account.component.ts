import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { UserPersonalDetails } from '../../Classes/Account-personalDetails/user-personal-details';
import { LocationService } from '../../Services/location.service';
import { Localisation } from '../../Classes/Location/localisation';
import { UpdateAdminAccountRequest } from '../../Classes/update-account/request/update-admin-account-request';
import { AdminService } from '../../Services/admin.service';
import { UpdateUserAccountRequest } from '../../Classes/update-account/request/update-user-account-request';
import { UserService } from '../../Services/user.service';
@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [HeaderComponent ,  ReactiveFormsModule  ] ,
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent implements OnInit {
  accountId!:number ; 
  accountType!:string; 
  locations:Localisation[]=[] ;


  accountDetails:UserPersonalDetails=new UserPersonalDetails() ;  

  updateFromGroup = this.formBuilder.group({
    firstName : ["" , [Validators.required] ] , 
    lastName:  ["" , [Validators.required] ]  , 
    email : ["" , [ Validators.required , Validators.email ]] , 
    passWord : ["" , [ Validators.required , Validators.minLength(8) ]] , 
    birthDate : ["" ,  [Validators.required] ] , 
    gender : ["" ,  [Validators.required] ] , 
    phone : ["" ,  [Validators.required] ] , 
    title : ["" ] , 
    description : [""] , 
    origin:  ["" , [Validators.required] ]  , 
    lkURL: ["" ] , 
    portURL: ["" ] , 
    pswsURL : ["" ] , 
    satisfactionLevel : ["" , [Validators.required] ] , 
    promotion  : ["" , [Validators.required] ] , 
    graduationDate : "" ,
    bacType : ["" , [Validators.required] ] , 



  })
  constructor (private accountService:AccountService , private formBuilder:FormBuilder , private locService : LocationService , private adminService:AdminService , private userService:UserService){ }

  ngOnInit(): void {
    this.accountId= Number(localStorage.getItem('userId')) ; 
    this.accountType=String (localStorage.getItem("userType")) ; 
    console.log("AccountId : " + this.accountId ) ; 
    console.log("AccountType : " + this.accountType ) ;
    // Get Locations 
    this.locService.getAllLocations().subscribe(result=>{
      this.locations=result ; 
      console.log(this.locations )
    })
    // 
      this.accountService.getPersonalAccountDetails(this.accountId).subscribe(result => {
        // Populate accountDetails
        this.accountDetails=result ;
        
        // Set ForGroup Default Values 
        this.updateFromGroup.get("firstName")?.setValue(this.accountDetails.firstName) ;  
        this.updateFromGroup.get("lastName")?.setValue(this.accountDetails.lastName) ;
        this.updateFromGroup.get("email")?.setValue(this.accountDetails.email) ;
        this.updateFromGroup.get("passWord")?.setValue(this.accountDetails.passWord) ;
        this.updateFromGroup.get("birthDate")?.setValue(this.accountDetails.birthDate) ;
        this.updateFromGroup.get("gender")?.setValue(this.accountDetails.sex) ;
        this.updateFromGroup.get("phone")?.setValue(this.accountDetails.phone) ;
        this.updateFromGroup.get("title")?.setValue(this.accountDetails.title) ;
        this.updateFromGroup.get("description")?.setValue(this.accountDetails.description) ;
        this.updateFromGroup.get("origin")?.setValue(String(this.accountDetails.origine?.id ) ) ;
        this.updateFromGroup.get("lkURL")?.setValue(this.accountDetails.linkedinURL  ) ;
        this.updateFromGroup.get("portURL")?.setValue(this.accountDetails.protfolioURL )  ;
        this.updateFromGroup.get("pswsURL")?.setValue(this.accountDetails.personalWesiteURL )  ;
        this.updateFromGroup.get("satisfactionLevel")?.setValue( String (this.accountDetails.satisfactionLevel ) )  ;
        this.updateFromGroup.get("promotion")?.setValue(  this.accountDetails.promotion  )  ;
        this.updateFromGroup.get("graduationDate")?.setValue(  this.accountDetails.graduationDate  )  ; 
        this.updateFromGroup.get("bacType")?.setValue(  this.accountDetails.bacType  )  ; 

      }) ; 
    // 


  }


 
  onSubmit():void{


    if (this.formIsValid()){
      // Chek Unique Email Constraint 
      // if  {
        this.accountService.emailIsUnique(this.updateFromGroup.get('email')?.value ).subscribe(result=>{

          if (result==true  || ( this.accountDetails.email ==this.updateFromGroup.get('email')?.value  && result==false) ){

            this.accountService.passWordIsUnique(this.updateFromGroup.get('passWord')?.value  ).subscribe(pass=>{
              if (pass==true || ( this.accountDetails.passWord ==this.updateFromGroup.get('passWord')?.value  && pass==false) ){
                // Case User Is Admin 
                if (this.accountType=="Admin" ){
                  const requestData = new UpdateAdminAccountRequest() ; 
                  requestData.firstName= String (this.updateFromGroup.get("firstName")?.value) ; 
                  requestData.lastName= String (this.updateFromGroup.get("lastName")?.value) ; 
                  requestData.email= String (this.updateFromGroup.get("email")?.value) ; 
                  requestData.passWord= String (this.updateFromGroup.get("passWord")?.value) ; 
                  requestData.birthDate=  this.updateFromGroup.get("birthDate")?.value  ; 
                  requestData.sex= String (this.updateFromGroup.get("gender")?.value) ; 
                  requestData.phone= String (this.updateFromGroup.get("phone")?.value) ; 
                  requestData.title= String (this.updateFromGroup.get("title")?.value) ; 
                  requestData.description= String (this.updateFromGroup.get("description")?.value) ; 
                  requestData.origineId= Number (this.updateFromGroup.get("origin")?.value) ; 
                  requestData.linkedinURL= String (this.updateFromGroup.get("lkURL")?.value) ; 
                  requestData.protfolioURL= String (this.updateFromGroup.get("portURL")?.value) ; 
                  requestData.personalWesiteURL= String (this.updateFromGroup.get("pswsURL")?.value) ; 
                  this.adminService.updateAccount(this.accountId,requestData).subscribe(result=>{
                    console.log(result) ; 
                    alert('votre compte a été mis à jour avec succès !')
                    window.location.reload();
                  })
                }
                else if(this.accountType=="User" ){
                  const requestData = new UpdateUserAccountRequest() ; 
                  requestData.firstName= String (this.updateFromGroup.get("firstName")?.value) ; 
                  requestData.lastName= String (this.updateFromGroup.get("lastName")?.value) ; 
                  requestData.email= String (this.updateFromGroup.get("email")?.value) ; 
                  requestData.passWord= String (this.updateFromGroup.get("passWord")?.value) ; 
                  requestData.birthDate=  this.updateFromGroup.get("birthDate")?.value  ; 
                  requestData.sex= String (this.updateFromGroup.get("gender")?.value) ; 
                  requestData.phone= String (this.updateFromGroup.get("phone")?.value) ; 
                  requestData.title= String (this.updateFromGroup.get("title")?.value) ; 
                  requestData.description= String (this.updateFromGroup.get("description")?.value) ; 
                  requestData.origineId= Number (this.updateFromGroup.get("origin")?.value) ; 
                  requestData.linkedinURL= String (this.updateFromGroup.get("lkURL")?.value) ; 
                  requestData.protfolioURL= String (this.updateFromGroup.get("portURL")?.value) ; 
                  requestData.personalWesiteURL= String (this.updateFromGroup.get("pswsURL")?.value) ;
                  requestData.promotion=  this.updateFromGroup.get("promotion")?.value  ; 
                  requestData.graduationDate=  this.updateFromGroup.get("graduationDate")?.value  ; 
                  requestData.satisfactionLevel= Number (this.updateFromGroup.get("satisfactionLevel")?.value) ; 
                  requestData.bacType= String (this.updateFromGroup.get("bacType")?.value) ;                  
                  this.userService.updateAccount(this.accountId,requestData).subscribe(result=>{
                    console.log(result) ; 
                    alert('votre compte a été mis à jour avec succès !')
                    window.location.reload();
                  })
                  

                }

              }else{alert('  Cette  Mot de passe est déjà utilisée. Veuillez en choisir un autre. ')}
            })

          }else{alert(' Cette adresse email est déjà utilisée. Veuillez en choisir un autre.') }
        })
    }

  }
  

  //   
  hasRequiredError(formControlName:string ) :boolean{

    if(this.updateFromGroup.get(formControlName)?.hasError('required') ) {  
        return true ; 
    }
    else{
      return false ; 
    }


  }

  // 
  hasInvalidEmailError (formControlName:string) :boolean {
    if (
      this.updateFromGroup.get(formControlName)?.invalid &&
      !this.updateFromGroup.get(formControlName)?.hasError("required")
    ){
      return true ; 
    }
    else{
      return false ; 
    }
  }
  // 
  isInvalid (formControlName:string) :boolean {
    if ( this.updateFromGroup.get(formControlName)?.invalid ){return true ; }
    else{return false }
  }
  // 
  hasInvalidPassWordError(formControlName:string) :boolean {

      if (
        this.updateFromGroup.get(formControlName)?.invalid &&
        !this.updateFromGroup.get(formControlName)?.hasError("required")
      ){
        return true ; 
      }
      else{
        return false ; 
      }
    

  }
  //Vlid Graduation Date
  invalidGraduationDate ():boolean {
    if (this.updateFromGroup.get("graduationDate")?.value==null ){
      return false ; 
    }else {
      const gradDate = new Date (String (this.updateFromGroup.get("graduationDate")?.value) )  ;
      const enrDate = new Date (String (this.updateFromGroup.get("promotion")?.value) )  ;
      if (gradDate<enrDate){

        return true ; 
      }
      else {
        return false ; 
      }
      
    }
  }  

  // 
  formIsValid():boolean {
    let commonFieldValid=false ; 
    if (
    this.updateFromGroup.get("firstName")?.valid &&
    this.updateFromGroup.get("lastName")?.valid &&
    this.updateFromGroup.get("email")?.valid &&
    this.updateFromGroup.get("passWord")?.valid &&
    this.updateFromGroup.get("birthDate")?.valid &&
    this.updateFromGroup.get("gender")?.valid &&
    this.updateFromGroup.get("phone")?.valid &&
    this.updateFromGroup.get("origin")?.valid  
    ){
      commonFieldValid= true ; 
    }

    if (commonFieldValid && this.accountType=="Admin"){
      return true ; 
    }
    else if (commonFieldValid && this.accountType=="User" && this.invalidGraduationDate()!=true &&  this.updateFromGroup.get("satisfactionLevel")?.value!='0' &&this.updateFromGroup.get("bacType")?.valid  && this.updateFromGroup.get("promotion")?.valid){
      return true ; 
    }
    return false ; 
  }

}
