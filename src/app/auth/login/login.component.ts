import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email: ['memo@hotmail.com', [Validators.required, Validators.email, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor( 
              private router: Router,
              private fb: FormBuilder ) { }

  ngOnInit(): void {
  }


  public login = () =>{
    console.log(this.loginForm.value);
    //this.router.navigateByUrl('/');
  }

}
