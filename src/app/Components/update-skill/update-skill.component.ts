import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { Skill } from '../../Classes/skill/skill';
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
import { NewSkill } from '../../Classes/skill/new-skill';

@Component({
  selector: 'app-update-skill',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent , ReactiveFormsModule],
  templateUrl: './update-skill.component.html',
  styleUrl: './update-skill.component.css'
})
export class UpdateSkillComponent implements OnInit  {
  skill!:Skill ; 

  skillForm = this.formBuilder.group({
    name : ['' , Validators.required] , 
    level : ['' , Validators.required] 

  })
  constructor(@Inject(MAT_DIALOG_DATA) public data:{skillId:number} , private userService :UserService , private formBuilder:FormBuilder){
  }
  ngOnInit(): void {
    console.log(this.data.skillId)
    this.userService.getSkillById(this.data.skillId).subscribe(result=>{
      this.skill=result ; 
      this.skillForm.get('name')?.setValue(this.skill.name) ; 
      this.skillForm.get('level')?.setValue(String( this.skill.level )) ; 
    })
  }
  onSubmit(){
    const skill = new NewSkill(); 
    skill.level = Number (this.skillForm.get('level')?.value)
    skill.name = String(this.skillForm.get('name')?.value )  ;
    this.userService.updateSkill(this.data.skillId , skill ).subscribe(result=>{
      console.log(result) ; 
      window.location.reload();
    })


  }


}
