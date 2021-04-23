import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  public usuario:any[] = [];
  public formSubmitted = false;
  public ticketFormCliente:any;
  public year = new Date().getFullYear();

  constructor(
              private routeActive: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private ticketServ: TicketsService,
              private clienteSrs: ClientesService,
              private translate: TranslateService,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);
    });

    this.translate.use(localStorage.getItem('idioma'));

  }




  /**
   * Método para crear tickets
   */
  public regisTicketCliente = () =>{
    this.formSubmitted = true;

    if ( this.ticketFormCliente.invalid ) {
      return; 
    }
    if ( !this.ticketFormCliente.get('acepto').value ) {
      return;
    }

    let traNombres;
    let traAsunto;
    let traDesc1;
    let traDesc2;
    let traName;
    let traEmail;
    let traPhone;
    let traAffair;
    let traMessage;
    let traDesc3;
    let traDesc4;
    let traDesc5;
    let traSuccess;
    let traError;
    this.translate.get('CliLegalAdministrator').subscribe((res: string) =>{traNombres = res});
    this.translate.get('TicketCreation').subscribe((res: string) =>{traAsunto = res});
    this.translate.get('ticketCreated').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('inClientLegalBF').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('Names').subscribe((res: string) =>{traName = res});
    this.translate.get('Email').subscribe((res: string) =>{traEmail = res});
    this.translate.get('phone').subscribe((res: string) =>{traPhone = res});
    this.translate.get('Affair').subscribe((res: string) =>{traAffair = res});
    this.translate.get('Message').subscribe((res: string) =>{traMessage = res});
    this.translate.get('Enter').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('checkTickets').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});

    this.ticketServ.creatTicketService( this.ticketFormCliente.value ).subscribe( (resp:any) =>{

      const json = {
        nombres: `${traNombres}`,
        apellidos: '',
        //email: 'desarrollomemo@gmail.com',
        email: 'timotheerodier@legalbf.com',
        asunto: `${traAsunto}`,
        descripcion: `<p>${traDesc1} <b>${resp.idticket}</b> ${traDesc2}</p>
                      <p><b>${traName}: </b>${this.usuario[0]['nombres_us']} ${this.usuario[0]['apellidos_us']}</p>
                      <p><b>${traEmail}: </b>${this.usuario[0]['email_us']}</p>
                      <p><b>${traPhone}: </b>${this.usuario[0]['telefono_us']}</p>
                      <p><b>${traAffair}: </b>${this.ticketFormCliente.get('asunto').value}</p>
                      <p><b>${traMessage}: </b>${this.ticketFormCliente.get('descripcion').value}</p>
                      <p>${traDesc3}: <a href="http://clientslegalbf.com" target="_blank">www.clientslegalbf.com</a> ${traDesc4}</p>
                      <br>
                      <p>©${this.year} - ${traDesc5}</p>`
      }

      this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{
        console.log(resp2)
      }, (err) =>{
        console.log(err)
      })

      Swal.fire(`${traSuccess}`, `${resp.msg} - Ticket ( ${resp.idticket} )`, 'success');
      setTimeout(() => { this.router.navigate(['dashboard/lista-tickets']) }, 2000);
      

    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
      console.log(err.error)
    })
    
  }



/**
 * Método para iniciar el formulario
 * @param usuario => Datos de usuario
 */
  public iniciarFormulario = (usuario:any) =>{
   
    this.ticketFormCliente = this.fb.group({
      nombrecompleto: [`${usuario[0]['nombres_us']} ${usuario[0]['apellidos_us']}`, [Validators.required, Validators.minLength(3)]],
      email: [usuario[0]['email_us'], [Validators.required, Validators.email, Validators.minLength(6)]],
      telefono: [usuario[0]['telefono_us'], [Validators.required, Validators.minLength(6)]],
      compania: [usuario[0]['compania_us'], [Validators.required, Validators.minLength(5)]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      acepto: ['', [Validators.required]],
      id: [usuario[0]['id_us'], [Validators.required, Validators.minLength(5)]],
    });
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.ticketFormCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

}
