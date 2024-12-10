import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SearchComponent } from './Components/search/search.component';
import { AddAccountComponent } from './Components/add-account/add-account.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { UpdateAccountComponent } from './Components/update-account/update-account.component';
import { AddDiplomaComponent } from './Components/add-diploma/add-diploma.component';
import { UpdateDiplomaComponent } from './Components/update-diploma/update-diploma.component';
import { AddJobComponent } from './Components/add-job/add-job.component';
import { UpdateJobComponent } from './Components/update-job/update-job.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AddSkillComponent } from './Components/add-skill/add-skill.component';
import { UpdateSkillComponent } from './Components/update-skill/update-skill.component';
import { TestComponent } from './Components/test/test.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
export const routes: Routes = [
    {path:"",redirectTo:'login',pathMatch:'full'},
    {path:"login",component:LoginComponent} ,
    {path:"search",component:SearchComponent} ,
    {path:"addAccount",component:AddAccountComponent} ,
    {path:"profile" , component:ProfileComponent }, 
    {path:"update-account" , component:UpdateAccountComponent } ,
    {path:"add-diploma" , component:AddDiplomaComponent} ,
    {path:"update-diploma/:diplomaId" , component:UpdateDiplomaComponent} ,
    {path:"add-job" , component:AddJobComponent} , 
    {path:"update-job/:jobId" , component:UpdateJobComponent } , 
    {path:"dashboard" , component:DashboardComponent } ,
    {path:"add-skill" , component:AddSkillComponent } ,
    {path:"update-skill/:skillId" , component:UpdateSkillComponent} , 
    {path:"test" , component:TestComponent} , 
    {path:"user-profile/:id" , component:UserProfileComponent} , 
    {path:"dashboard" , component:DashboardComponent}  
];
