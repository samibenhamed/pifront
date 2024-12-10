import { Component , OnInit} from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { NewAdmin } from '../../Classes/NewAccount/NewAdmin';
import { LocationService } from '../../Services/location.service';
import { Localisation } from '../../Classes/Location/localisation';
import { CommonModule } from '@angular/common';
import { NewUser } from '../../Classes/NewAccount/NewUser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports:  [FormsModule , CommonModule , ReactiveFormsModule , HeaderComponent , RouterLink] ,
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.css'
})
export class AddAccountComponent implements OnInit {

  locations!:Localisation[] ;
  adminId!:number ;
  adminUniversity!:string ; 
  accountType!:string;


  constructor(private adminService:AdminService ,private  locationService:LocationService , private formBuilder:FormBuilder , private accountService:AccountService ){}

  ngOnInit(): void {

    this.adminId=Number(localStorage.getItem("userId")) ; 
    this.adminService.getAdminUniversity(this.adminId).subscribe((value)=>{
    this.adminUniversity=value.adminUniversity ; 
    });   

    this.locationService.getAllLocations().subscribe((result)=>{
      this.locations=result ;
    })

  }

  
  newAccountForm = this.formBuilder.group({
    accountType : ['' , Validators.required ] , 
    firstName : ['' , Validators.required ] , 
    lastName :  ['' , Validators.required ] , 
    email : ['' , [Validators.required , Validators.email ]] , 
    password : ['' , [Validators.required , Validators.minLength(8)]] , 
    phone : ['' , Validators.required ] ,
    birthDate : ['' , Validators.required ] ,
    genre :  ['' , Validators.required ] , 
    origin :  ['' , Validators.required ] , 

    enrollmentDate  :  ['' , Validators.required ] , 
    graduationDate : "" ,
    bacType :   ['' , Validators.required ]  



  });


  formIsValid =false ; 
  isSubmited=false ; 

  onSubmit():void {
    this.isSubmited=true ;
    this.validateForm() ;
    console.log( "Form is Valid : " + this.formIsValid)
    if (this.formIsValid){
      let form=new FormData();
      if(this.newAccountForm.get("accountType")?.value=="User"){
        const userData =new NewUser() ;
        userData.university=this.adminUniversity ; 
        userData.firstName=  String (this.newAccountForm.get("firstName")?.value) ;
        userData.lastName=  String (this.newAccountForm.get("lastName")?.value) ;
        userData.email=  String (this.newAccountForm.get("email")?.value) ; 
        userData.passWord=  String (this.newAccountForm.get("password")?.value) ; 
        userData.phone=  String (this.newAccountForm.get("phone")?.value) ; 

        userData.birthDate = this.newAccountForm.get("birthDate")?.value  ;

        userData.sex=  String (this.newAccountForm.get("genre")?.value) ;
        userData.origin=  Number (this.newAccountForm.get("origin")?.value) ; 
        userData.promotion = this.newAccountForm.get("enrollmentDate")?.value ;
        userData.graduationDate = this.newAccountForm.get("graduationDate")?.value ;
        userData.bacType=  String (this.newAccountForm.get("bacType")?.value) ;
  
        form.append("data",
        new Blob([JSON.stringify(userData)] , {type:'application/json'}) 
        ) ;
  
  
      } else if (this.newAccountForm.get("accountType")?.value=="Admin"){
        const adminData =new NewAdmin() ;
        adminData.university=this.adminUniversity ;
        adminData.firstName=  String (this.newAccountForm.get("firstName")?.value) ;
        adminData.lastName=  String (this.newAccountForm.get("lastName")?.value) ;
        adminData.email=  String (this.newAccountForm.get("email")?.value) ; 
        adminData.passWord=  String (this.newAccountForm.get("password")?.value) ; 
        adminData.phone=  String (this.newAccountForm.get("phone")?.value) ; 
        adminData.birthDate = this.newAccountForm.get("birthDate")?.value ;
        adminData.sex=  String (this.newAccountForm.get("genre")?.value) ;
        adminData.origin=  Number (this.newAccountForm.get("origin")?.value) ; 
        form.append("data",
        new Blob([JSON.stringify(adminData)] , {type:'application/json'}) 
        ) ;
       }
  
      // add Image (Empty File ) 
        const blobContent = new Blob([''], { type: 'text/plain' });
        const emptyfile = new File([blobContent], 'empty', { type: 'text/plain' });
        form.append("imageFile" , emptyfile )
      // // Send Data 
      //  Check Unique Email Constraint 
      this.accountService.emailIsUnique( this.newAccountForm.get("email")?.value).subscribe(result=>{
        if(result==true){


            // Check Unique PassWor constraint 
            this.accountService.passWordIsUnique(this.newAccountForm.get("password")?.value).subscribe(result=>{
              if(result==true ){
                if (this.newAccountForm.get("accountType")?.value=="Admin"){ 
                  this.adminService.addAdmin(form).subscribe((reslut)=>{
                    console.log(reslut) ; 
                    alert("ce compte a été ajouté avec succès") ;
                    window.location.reload()
                   }) ; 
                 }  
                else if (this.newAccountForm.get("accountType")?.value=="User"){
                      this.adminService.addUser(form).subscribe((reslut)=>{
                      console.log(reslut) ; 
                      alert("ce compte a été ajouté avec succès") ;
                      window.location.reload()
                      }) ; 
                 }
              }
              else{
                alert(" Cette  Mot de passe est déjà utilisée. Veuillez en choisir un autre.")
              }
            })



        }
        else {
          alert(" Cette adresse email est déjà utilisée. Veuillez en choisir un autre. ")
        }

        })


      this.formIsValid=false ; 
    }



  }


  validateForm():void{
    let commonFieldValid:Boolean = false ; 

    if (
        this.newAccountForm.get("accountType")?.valid && 
        this.newAccountForm.get("firstName")?.valid && 
        this.newAccountForm.get("lastName")?.valid && 
        this.newAccountForm.get("email")?.valid && 
        this.newAccountForm.get("password")?.valid && 
        this.newAccountForm.get("phone")?.valid && 
        this.newAccountForm.get("birthDate")?.valid && 
        this.newAccountForm.get("genre")?.valid && 
        this.newAccountForm.get("origin")?.valid ){
          commonFieldValid=true  ; 
  }


  if (  this.newAccountForm.get("accountType")?.value=="Admin" &&  commonFieldValid ){
    this.formIsValid=true ; 
  }
  else if (  this.newAccountForm.get("accountType")?.value=="User" &&  commonFieldValid &&
  this.newAccountForm.get("enrollmentDate")?.valid && 
  this.newAccountForm.get("graduationDate")?.valid &&
  this.newAccountForm.get("bacType")?.valid  
  ){
    this.formIsValid=true ; 
  }


}



}
