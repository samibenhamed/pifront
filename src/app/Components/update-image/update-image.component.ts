import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AccountService } from '../../Services/account.service';
@Component({
  selector: 'app-update-image',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './update-image.component.html',
  styleUrl: './update-image.component.css'
})
export class UpdateImageComponent  implements OnInit{
  accountId!:number ; 
  imageURL!:any ; 
  imageFile!:File ; 
  invalidFileType=false ; 
  fileToLarge=false ; 
  hasImage=false ; 

  constructor(public dialogRef: MatDialogRef<UpdateImageComponent> , private accountService:AccountService)  {}

  ngOnInit(): void {
    this.accountId = Number(localStorage.getItem("userId"))  ;
    console.log('AccountId : ' ,this.accountId ); 
    this.accountService.getPersonalAccountDetails(this.accountId).subscribe(result=>{
      const accountDetails = result ;
      if (accountDetails.image?.name!=null) {
        this.hasImage=true ; 
        // 
        const imageBlop = this.dataUriToBlop(accountDetails.image.bytes , accountDetails.image.type) ; 
        const imageFile = new File ([imageBlop] , accountDetails.image.name , {type:accountDetails.image.type})
        let reader = new FileReader () ; 
        reader.readAsDataURL(imageFile) ; 
        reader.onload = ()=>{
          this.imageURL=reader.result ; 
        }
      } 
    })

    
  }
  onFileSelecte(event:any):void{
    if(event.target.files )   {
      this.imageFile=event.target.files[0] ; 
      console.log(this.imageFile.type )
      const validTypes:string[] =['image/jpeg' , 'image/jpg' , 'image/png']  ;

      if (validTypes.indexOf ( this.imageFile.type) !=-1   ){
        console.log(this.imageFile.size)
        this.invalidFileType=false ; 
        if (this.imageFile.size <1000000){
          this.fileToLarge=false ; 
          let reader = new FileReader () ; 
          reader.readAsDataURL(this.imageFile) ; 
          reader.onload = ()=>{
            this.imageURL=reader.result ; 
          }
        }
        else{
          this.fileToLarge=true; 
        }
      }
      else{
        this.invalidFileType=true ; 
      }
    }

  }
  // 
  onClick(){
    if (!this.invalidFileType && this.imageFile && !this.fileToLarge ){
      const request = new FormData() ;
      request.append("imageFile", this.imageFile ) ; 
      this.accountService.updateImage(this.accountId,request).subscribe(result=>{
        console.log(result) ;
        window.location.reload();
      })
    }
  }
  onDelete(){
    this.accountService.deleteImage(this.accountId).subscribe()
    window.location.reload();
  }

  //
  public dataUriToBlop(imageBytes:any , imageType:string):Blob{
    const byteString = window.atob(imageBytes) ;
    const arrayBuffer = new ArrayBuffer (byteString.length ) ;
     const int8Array= new Uint8Array(arrayBuffer) ; 

     for (let i=0 ; i<byteString.length ;i++ ){
      int8Array[i] =  byteString.charCodeAt(i) ;
     }

     return new Blob( [int8Array] , {type:imageType } ) 
  }
}
