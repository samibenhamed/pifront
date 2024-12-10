import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserAccountRequest } from '../Classes/update-account/request/update-user-account-request';
import { UpdateUserAccountResponse } from '../Classes/update-account/response/update-user-account-response';
import { AddDiplomaRequest } from '../Classes/diploma/add-diploma-request';
import { Diploma } from '../Classes/diploma/diploma';
import { JobPersonalDetails } from '../Classes/job/job-Personal-Details';
import { NewJobRequest } from '../Classes/job/new-job-request';
import { Job } from '../Classes/job/job';
import { Skill } from '../Classes/skill/skill';
import { NewSkill } from '../Classes/skill/new-skill';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }
  baseURL = "http://localhost:8080/PI/OLTP/API/" ; 

  getSatisfactionLevel(userId:number ) : Observable<number>{
    return this.httpClient.get<number>(this.baseURL+"get-stisfaction-level/"+userId) ; 
  }

  // 
  updateSatisfactionLevel( {userId ,satisfactionLevel }: { userId:number , satisfactionLevel:number }):Observable<number> {
    return  this.httpClient.put<number>(this.baseURL+"update-st-level" , {userId ,satisfactionLevel } )  ; 
  }

  updateAccount( accountId:number , data : UpdateUserAccountRequest ):Observable<UpdateUserAccountResponse> {
    return this.httpClient.put<UpdateUserAccountResponse>(this.baseURL+"update-user-account/"+accountId , data ) ; 
  }

  addDiploma(  userId:number, data :AddDiplomaRequest) : Observable <Diploma> {

    return this.httpClient.post<Diploma>(this.baseURL+"add-diploma/"+userId,data); 
  }

  getAllDiplomas(userId:number):Observable<Diploma[]> {
    return this.httpClient.get<Diploma[]>(this.baseURL+"get-all-diplomas/"+userId) ; 
  }

  getDiplomaById(diplomaId:number):Observable<Diploma>{
    return this.httpClient.get<Diploma>(this.baseURL+"get-diploma-personal-details/"+diplomaId) ; 
  }

  updateDiploma(diplomaId:number , request:AddDiplomaRequest):Observable<Diploma>{
    return this.httpClient.put<Diploma>(this.baseURL+"update-diploma/" + diplomaId , request ) ; 
  }

  deleteDiploma(diplomaId:number):any{
    return this.httpClient.delete(this.baseURL+'delete-diploma/'+diplomaId) ; 

  }

  // 
  addJob( userId:number , request:NewJobRequest):Observable<JobPersonalDetails>{
    return this.httpClient.post<JobPersonalDetails>(this.baseURL+"add-job/" + userId , request) ; 
  }

  // Get All Jobs 
  getAllJobs(userId:number):Observable<Job[]>{
    return this.httpClient.get<Job[]>(this.baseURL+"get-all-jobs/"+userId )
  }
  // 

  getJobById(jobId:number):Observable<JobPersonalDetails>{
    return this.httpClient.get<JobPersonalDetails>(this.baseURL+"get-personal-job-details-by-job-id/"+jobId ) ; 
  }

  updateJob(jobId:number , request:NewJobRequest ): Observable<JobPersonalDetails> {
    return this.httpClient.put<JobPersonalDetails>(this.baseURL+"update-job/"+jobId , request) ; 
  }

  deleteJob(jobId:number ):any {
    return this.httpClient.delete(this.baseURL+"delete-job/"+jobId ) ; 

  }



  addSkill(userId :number , requestData :NewSkill ):Observable<Skill>{
    return this.httpClient.post<Skill>(this.baseURL+"add-skill/"+userId,requestData) ; 
  }

  getAllSkills(userId:number):Observable<Skill[]>{
    return this.httpClient.get<Skill[]>(this.baseURL+"get-all-skills/"+userId ) ; 
  }

  getSkillById(skillId:number):Observable<Skill>{

    return this.httpClient.get<Skill>(this.baseURL+"get-skill-by-id/"+skillId) ; 
  }

  updateSkill(skillId:number , data:NewSkill ) : Observable<Skill>{
    return this.httpClient.put<Skill>(this.baseURL+"update-skill/"+skillId , data) ; 
  }

  deleteSkill(skllId:number):any {
    return this.httpClient.delete(this.baseURL+"delete-skill/"+skllId)
  }

}
