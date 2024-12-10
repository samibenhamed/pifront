import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { undetailedAccount } from '../../Classes/Account-Undetailed/undetailedAccount';

import { AccountService  } from '../../Services/account.service';
import { Localisation } from '../../Classes/Location/localisation';
import { UserService } from '../../Services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { LocationService } from '../../Services/location.service';
import { AdminService } from '../../Services/admin.service';

import {MatGridListModule} from '@angular/material/grid-list';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-search',
  standalone: true,
  imports:  [MatIconModule , HttpClientModule ,HeaderComponent , ReactiveFormsModule , RouterLink , FormsModule , MatGridListModule , MatButtonModule , MatCardModule ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit  {
  userType!:string;
  userId!:number;
  locations:Localisation[]=[]
  // 
  accounts!:undetailedAccount[] ;
    // 
  transformedAccounts:{
    "dtype":string  ,
    "id":number  ,
    "firstName" :string  ,
    "lastName":string  ;
    "title":string ,
    "university" : string ,
    "origine":Localisation,
    "imageURL":any   ,
    "promotion":any 
    "skills":string[]
     } [] =[] ;
    // 
  userSatisfactionLevel!:number ; 

  constructor ( private adminService:AdminService,private router:Router , private accountService :AccountService , private userServie:UserService , private formBuilder:FormBuilder , private locService:LocationService ){
  }

  stisfactionFormRegister = this.formBuilder.group( {
    satisfactionLeve : ['' , Validators.required ]
  })

  onSubmitSatisfaction():void{
    console.log("Satisfaction Submited ")
    if (this.stisfactionFormRegister.valid){
      console.log("Valid ! ")
      console.log('Chosen Stisfaction leve' + this.stisfactionFormRegister.get("satisfactionLeve")?.value)
      this.userSatisfactionLevel=Number ( this.stisfactionFormRegister.get("satisfactionLeve")?.value )  ; 
        this.userServie.updateSatisfactionLevel({userId:this.userId , satisfactionLevel:this.userSatisfactionLevel})
        .subscribe(result =>{
          console.log('Resullt : ' , result)
        })

    }
    else {
      console.log("Invalid  ! ")

    }

  }

  ngOnInit(): void {
    this.userType = String (localStorage.getItem("userType") ) ;
    console.log(this.userType) ; 
    this.userId = Number(localStorage.getItem("userId") ) ;
    console.log(this.userId) ; 

    //Populate Locations 
    this.locService.getAllLocations().subscribe(result=>{
      this.locations=result ; 
    }) 

    //Get User Satisfaction Level To Force Update if 0 
    if (this.userType=="User"){
      this.userServie.getSatisfactionLevel(this.userId).subscribe(result=>{
        this.userSatisfactionLevel=result ; 
    console.log( "Satisfaction Level : "+ this.userSatisfactionLevel)

      })
    } 


    // Transform Accounts List to Create An Image URL ... 
    this.accountService.getAllAccounts().subscribe(result=>{
      this.accounts=result ; 
      for (let account of this.accounts ){
        if (account.image.name == null ){

          this.transformedAccounts.push ({
            "dtype"  : account.dtype   ,
            "id":account.id  ,
            "firstName" :account.firstName,
            "lastName":account.lastName,
            "title":account.title ,
            "university" : account.university ,
            "origine":account.origine,
            "imageURL":null ,
            "promotion":account.promotion  ,
            "skills":account.skills
             })

        }
        else {

          // 1- Create a image Bloop 
           const imageBlop = this.dataUriToBlop(account.image.bytes,account.image.type) ; 
           // 2- Create an image File 
           const imageFile = new File ( [imageBlop] , account.image.name , {type:account.image.type})
           //3- Create an Image URL 
          let  imageURL!:any ; 
          let reader = new FileReader() ;
          // Get a base64 representation Of The Image 
          reader.readAsDataURL(imageFile) ; 
          // 
          reader.onload = ()=> {
          imageURL =reader.result ; 
          this.transformedAccounts.push({
            "dtype"  : account.dtype   ,
            "id":account.id  ,
            "firstName" :account.firstName,
            "lastName":account.lastName,
            "title":account.title ,
            "university" : account.university ,
            "origine":account.origine,
            "imageURL":imageURL ,
            "promotion":account.promotion  ,
            "skills":account.skills


             })
          }


        }
      }

    })
  }



  public dataUriToBlop(imageBytes:any , imageType:string):Blob{
    const byteString = window.atob(imageBytes) ;
    const arrayBuffer = new ArrayBuffer (byteString.length ) ;
     const int8Array= new Uint8Array(arrayBuffer) ; 

     for (let i=0 ; i<byteString.length ;i++ ){
      int8Array[i] =  byteString.charCodeAt(i) ;
     }

     return new Blob( [int8Array] , {type:imageType } ) 
  }

  //Add Account 
  addUser():void{
    this.router.navigate(['addAccount']); 
  }
  deleteAccount(accountId:number){


    if(confirm('es-tu sûr de vouloir supprimer ce compte  ! ')){
      this.adminService.deleteAccount(accountId).subscribe((result:any)=>{
        console.log(result) ; 
        window.location.reload() ; 
      })
    }

  }



// ////////////// Search 
searchKey:string="" ; 
searchForm = this.formBuilder.group({
  searchKey : '' 
})
setSearchKey(){
  this.searchKey=String(this.searchForm.get('searchKey')?.value ); 

}
hasSearchKey(firstName:string , lastName:string):boolean{
  if(this.searchKey.trim()=="" ){
    return true ; 
  }
  else if(firstName.toLocaleLowerCase().includes(this.searchKey.toLocaleLowerCase() )
  || lastName.toLocaleLowerCase().includes(this.searchKey.toLocaleLowerCase() )
  ) {
    return true ; 
  }
  return false ; 
}

  // /////// Filter 
hideFiltter:boolean=true ; 
filter(){
  this.hideFiltter= !this.hideFiltter ; 
}

  selectedSkills:Set<string>=new Set<string> ; 
  skillForm = this.formBuilder.group({
    name : ['' , Validators.required ]
  })
  addToSelectedSkills (){
    if(this.skillForm.valid){
      this.selectedSkills.add(String(this.skillForm.get('name')?.value ).toLocaleLowerCase() )
    }
  }
// Remove Skill 
removeSkill(skill:string){
  this.selectedSkills.delete(skill) ; 
}

// 
hasSelectedSkills(skills:string[]):boolean {
  if(this.selectedSkills.size==0){
    return true ; 
  }
  else {
    if(skills!=undefined ){
      for(let skill of skills ){
        for (let selectedSk of this.selectedSkills ){
          if (skill.toLocaleLowerCase().trim()==selectedSk.toLocaleLowerCase().trim() ){
            return true ; 
          }
        }
      }

    }


  }
  return false ; 

}
// AccountType 

selectedAccountType:string ="User"; 

hasSelectedAccountType(accountType:string): boolean{
  if(this.selectedAccountType=="all"){
    return true ; 
  }
  else if(accountType==this.selectedAccountType){

    return true ; 
  }
  else {return false }
}
// promotion
selectedPromotion :string = "all";

hasSelectedPromotion(promotion:any):boolean{
  if(this.selectedPromotion=="all"){

    return true ; 
  }
  else if (promotion!=undefined ){
    const year = new Date(promotion).getFullYear() ;
    if (year.toString()==this.selectedPromotion){
      return true ; 
    } 
  }
  return false 

}

// University 
selectedUinivesity:string="all"
hasSelectedUniversity(university :string ):boolean{
  if(this.selectedUinivesity=="all"){return true }
  else if(this.selectedUinivesity==university){return true }
  return false  ;
}

// Origine 
selectedOrigine="all" ; 

hasSelectedOrigine(origineId:number): boolean{
  if(this.selectedOrigine=="all"){
    return true ; 
  }
  else if(origineId.toString()==this.selectedOrigine){
    return true ; 

  }
return false ; 
}

// Pour Afficher que L'anne D'inscription 
getPromotion(year:string ):string{
  const d = new Date(year) ; 
  return d.getFullYear().toString(); 
}

viewProfile(profileId:number):void{
    this.router.navigate(['/user-profile' , profileId] )
}

}
