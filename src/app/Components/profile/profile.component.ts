import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AccountService } from '../../Services/account.service';
import { UserPersonalDetails } from '../../Classes/Account-personalDetails/user-personal-details';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { Routes , RouterModule} from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { Diploma } from '../../Classes/diploma/diploma';
import { UserService } from '../../Services/user.service';
import { Job } from '../../Classes/job/job';
import { AddSkillComponent } from '../add-skill/add-skill.component';
import { Skill } from '../../Classes/skill/skill';
import { UpdateSkillComponent } from '../update-skill/update-skill.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent ,  UpdateAccountComponent , RouterModule , RouterLink , MatButtonModule  , CommonModule , MatIcon] ,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit {
  accountId!:number ;
  accountType!:string ;
  accountDetails:UserPersonalDetails=new UserPersonalDetails() ;  
  imageURL!:any;
  diplomas:Diploma[]=[];
  jobs:Job[]=[];
  skills:Skill[]=[] ; 

  constructor(private accountService:AccountService , public dialog:MatDialog , private router:Router , private userService:UserService){}
  ngOnInit(): void {
    this.accountType= String(localStorage.getItem('userType')) ;
    this.accountId = Number(localStorage.getItem("userId"))  ;

    // Get Account Details 
    this.accountService.getPersonalAccountDetails(this.accountId).subscribe(result=>{
      this.accountDetails= result ; 
      this.accountDetails.origine=result.origine;
      console.log( this.accountDetails) ; 
      if (this.accountDetails.image?.name!=null ){
                  // 
                  const imageBlop = this.dataUriToBlop(this.accountDetails.image?.bytes,  this.accountDetails.image?.type) ; 
                  //  
                  const imageFile = new File ( [imageBlop] , this.accountDetails.image?.name , {type:this.accountDetails.image?.type})
                  // 
                 let reader = new FileReader() ;
                 //  
                 reader.readAsDataURL(imageFile) ; 
                 // 
                 reader.onload = ()=> {
                 this.imageURL =reader.result ;}


      }
    })

    // Get User Diplomas : 
    if(this.accountType=="User"){
      this.userService.getAllDiplomas(this.accountId).subscribe(result=>{
        this.diplomas =result ; 
      })

      this.userService.getAllJobs(this.accountId).subscribe(result=>{
        this.jobs =result ; 
        console.log(result) ; 
      })

      this.userService.getAllSkills(this.accountId).subscribe(result=>{
        this.skills= result ; 
      })

    }
  }





















  //For Update Image  
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UpdateImageComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  } 
  // 
  onAddDiplomaClick():void{
    this.router.navigate( ['/add-diploma'])
  }
  
  // 

  onUpdateDiploma(diplomaID:number){
    this.router.navigate(['/update-diploma' , diplomaID] )
  }

  onDeleteDiploma(diplomaId:number){
    if(  confirm("Etes-vous sûr de vouloir supprimer ce diplôme ! ")){

      this.userService.deleteDiploma(diplomaId).subscribe() ; 
      window.location.reload() ; 
    } 
  


  }
  //
  
  onAddJob():void{
    this.router.navigate(['/add-job'])
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

  // 
  updateJob(jobId:number):void{
    this.router.navigate(['/update-job' , jobId] )
  }

  deleteJob(jobId:number):void{
    if(confirm("êtes-vous sûr de vouloir supprimer cette expérience"   ) )  {

      this.userService.deleteJob(jobId).subscribe() ; 
       window.location.reload() ;

    }

    
  }



  
    addSkill(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(AddSkillComponent, {
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    } 

    updateSkill(enterAnimationDuration: string, exitAnimationDuration: string , id:number): void {
      this.dialog.open(UpdateSkillComponent, {
        data: {
           skillId : id
        },
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    } 

    deleteSkill(skillId:number):void{
      if(confirm("êtes-vous sûr de vouloir supprimer cette compétence ?")){
        this.userService.deleteSkill(skillId).subscribe((result:any)=>{
          window.location.reload();
        }
        ) ; 
      }

    }

    getSkillLevelPercentage(level:number):number{
      return (level/5 )* 100 ;
    }


}
