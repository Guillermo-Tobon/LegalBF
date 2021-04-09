import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public usuario:any[] = [];
  public idioma:string;

  constructor(
              private autServ: AuthService,
              private translate: TranslateService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.autServ.usuario;

    this.idioma = localStorage.getItem('idioma');
    this.translate.use(this.idioma);
  }

/**
 * Método para navegar a tickets
 */
  public navegarTicket = () =>{
    this.router.navigate(['dashboard/tickets', JSON.stringify(this.usuario)])
  }


  /**
   * Método para cerrar sesión user
   */
  public logoutUser = () =>{
    let traTitle;
    let traText;
    let traButton;
    this.translate.get('DoWantLogOut').subscribe((res: string) =>{traTitle = res});
    this.translate.get('RememberProcessedData').subscribe((res: string) =>{traText = res});
    this.translate.get('YesLogOut').subscribe((res: string) =>{traButton = res});

    Swal.fire({
      title: `${traTitle}`,
      text: `${traText}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${traButton}`
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => { this.autServ.logoutService(); }, 1200);
      }
    })

  }

}
