import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router:Router,private auth:AuthServiceService) { }

  ngOnInit(): void {
  }
logout(){
  localStorage.clear();
  this.router.navigate(['/login']);
  this.auth._isLoggedIn.next(false);
}
}
