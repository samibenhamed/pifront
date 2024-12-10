import { Component  ,OnInit} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { NewSkill } from '../../Classes/skill/new-skill';


@Component({
  selector: 'app-add-skill',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent , ReactiveFormsModule ]  ,
  templateUrl: './add-skill.component.html',
  styleUrl: './add-skill.component.css'
})
export class AddSkillComponent  implements OnInit{

  userId !:number ;
  constructor (private formBuilder:FormBuilder , private userService:UserService){
  }

  skillForm = this.formBuilder.group({
    name : ['' , Validators.required] , 
    level : ['' , Validators.required] 

  })
  ngOnInit(): void {
    this.userId=Number  (localStorage.getItem("userId") )  ;
  }

  onSubmit():void{
    const requestData = new NewSkill() ; 
    requestData.level=Number(this.skillForm.get('level')?.value ) ; 
    requestData.name= String (this.skillForm.get('name')?.value ).toLocaleLowerCase()   ; 
    this.userService.addSkill(this.userId , requestData).subscribe(result=>{
      console.log(result) ; 
      window.location.reload()
    })
  }
}
