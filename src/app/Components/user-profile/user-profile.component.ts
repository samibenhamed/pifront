import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AccountService } from '../../Services/account.service';
import { UserPersonalDetails } from '../../Classes/Account-personalDetails/user-personal-details';
import { CommonModule } from '@angular/common';
import { Diploma } from '../../Classes/diploma/diploma';
import { UserService } from '../../Services/user.service';
import { Job } from '../../Classes/job/job';
import { Skill } from '../../Classes/skill/skill';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent,CommonModule], 
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  accountId!:number;
  accountType!:string ; 
  accountDetails:UserPersonalDetails=new UserPersonalDetails() ;  
  imageURL!:any;
  diplomas:Diploma[]=[];
  jobs:Job[]=[];
  skills:Skill[]=[] ; 

  constructor(private activatedRoute:ActivatedRoute ,  private userService:UserService , private accountService:AccountService){}
  ngOnInit(): void {
    this.accountId=Number(this.activatedRoute.snapshot.paramMap.get('id')) 
    
    // Get Account Details 
    this.accountService.getPersonalAccountDetails(this.accountId).subscribe(result=>{
      this.accountDetails= result ; 
      this.accountDetails.origine=result.origine;
      this.accountType=result.dtype;
      if(this.accountType=="User"){
        this.userService.getAllDiplomas(this.accountId).subscribe(result=>{
          this.diplomas =result ; 

        })
  
        this.userService.getAllJobs(this.accountId).subscribe(result=>{
          this.jobs =result ; 
        })
  
        this.userService.getAllSkills(this.accountId).subscribe(result=>{
          this.skills= result ; 
          console.log(result) ; 

        })
  
      }
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

      
  }





// Converting The Image 
  public dataUriToBlop(imageBytes:any , imageType:string):Blob{
    const byteString = window.atob(imageBytes) ;
    const arrayBuffer = new ArrayBuffer (byteString.length ) ;
     const int8Array= new Uint8Array(arrayBuffer) ; 

     for (let i=0 ; i<byteString.length ;i++ ){
      int8Array[i] =  byteString.charCodeAt(i) ;
     }

     return new Blob( [int8Array] , {type:imageType } ) 
  }




  getSkillLevelPercentage(level:number):number{
    return (level/5 )* 100 ;
  }
}
