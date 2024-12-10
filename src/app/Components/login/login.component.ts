import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../Classes/Login/loginRequest';
import { LoginService } from '../../Services/login.service';
import { LoginResponse } from '../../Classes/Login/loginResponse';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  logins:LoginRequest = new LoginRequest();
  loginResponse:LoginResponse = new LoginResponse() ;

  constructor (private loginService:LoginService  , private router:Router ){

  }
  ngOnInit(): void {
  }

  onSubmit():void{

    this.loginService.checkLogins(this.logins).subscribe((result)=>{
      this.loginResponse.dtype=result.dtype ;
      this.loginResponse.id=result.id ;

      if (this.loginResponse.id==null ||this.loginResponse.dtype==null ){
        alert("Invalid login information!");
      }
      else {
        this.loginService.change_userId_userType(this.loginResponse); 
        this.router.navigate(['search']  ) ; 
      }

    })

  }
}
