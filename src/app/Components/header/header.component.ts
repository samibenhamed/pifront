import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { Routes , RouterModule} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchComponent , RouterModule , RouterLinkActive ,RouterLink , RouterOutlet] ,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  constructor(private loginService:LoginService , private router:Router){

  }

logOut():void {
  this.loginService.logOut();
  this.router.navigate(['login'])
} 
userType!:String ; 
ngOnInit(): void {
  this.userType = String (localStorage.getItem("userType") ) ;
}

}
