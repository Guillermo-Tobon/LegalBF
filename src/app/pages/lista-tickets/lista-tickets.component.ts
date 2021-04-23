import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lista-tickets',
  templateUrl: './lista-tickets.component.html',
  styleUrls: ['./lista-tickets.component.css']
})
export class ListaTicketsComponent implements OnInit {

  public usuario:any[] = [];
  public tickets:any[] = [];
  public editTicket:{} = {};
  public responTicket:{} = {};
  public FormEditTicket:any;
  public FormAnswerTicket:any;
  public formSubmitted = false;
  public year = new Date().getFullYear();

  constructor(
              private authServ: AuthService,
              private ticketServ: TicketsService,
              private clienteSrs: ClientesService,
              private translate: TranslateService,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllTickets();
      
    } else {
      this.getTicketsUsuario(this.usuario[0].id_us);
      
    }

    //Iniciar formularios
    this.FormEditTicket = this.fb.group({
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(20)]],
    })

    this.FormAnswerTicket = this.fb.group({
      respuesta: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.translate.use(localStorage.getItem('idioma'));
    
  }


  /**
   * Método para obtener todos los tickets
   */
  public getAllTickets = () =>{
    this.ticketServ.getAllTicketsService().subscribe( (resp:any) =>{
      this.tickets = resp.tickets || []; 

    }, err => console.error(err))
  }



  /**
   * Método para obtener los ticket por id usuario
   * @param id => ID de usuario logueado
   */
  public getTicketsUsuario = (id:any) =>{

    this.ticketServ.getTicketByIdService(id).subscribe( (resp:any) =>{
      this.tickets = resp.tickets; 
      
    }, err => console.error(err))
  }


  /**
   * Método para editar tickets
   * @param ticket => Ticket a modificar
   */
  public modalEditTicket = (ticket:any) =>{
    this.editTicket =  ticket;

    this.FormEditTicket = this.fb.group({
      asunto: [this.editTicket['asunto_tic'], [Validators.required, Validators.minLength(3)]],
      mensaje: [this.editTicket['mensaje_tic'], [Validators.required, Validators.minLength(3)]],
    })

  }



  /**
   * Método para contestar tickets
   * @param ticket => Ticket a modificar
   */
  public modalContestTicket = (ticket:any) =>{
    this.responTicket =  ticket;

  }



  /**
   * Método para actualizar ticket por id
   * @param idTicket => ID ticket
   */
  public editarTicket = (idTicket:string) =>{

    let traSuccess;
    let traError;
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});

    this.ticketServ.updateTicketService( this.FormEditTicket.value, idTicket ).subscribe( (resp:any) =>{

      if(resp.ok){
        Swal.fire(`${traSuccess}`, resp.msg, 'success');
        setTimeout(() => { window.location.reload(); }, 2000);
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
    })

  }




  /**
   * Método para contestar ticket por id
   * @param Ticket => ticket
   */
  public contestarTicket = (ticket:any) =>{
    this.formSubmitted = true;

    if ( this.FormAnswerTicket.invalid ) {
      return; 
    }

    let traAsunto1;
    let traAsunto2;
    let traDesc1;
    let traTicket;
    let traAffair;
    let traMessage;
    let traAnswer;
    let traDesc2;
    let traDesc3;
    let traDesc4;
    let traDesc5;
    let traSuccess;
    let traError;
    this.translate.get('ResponseTicket').subscribe((res: string) =>{traAsunto1 = res});
    this.translate.get('createdClientsLegalBF').subscribe((res: string) =>{traAsunto2 = res});
    this.translate.get('adminRespondedTicket').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('ticket').subscribe((res: string) =>{traTicket = res});
    this.translate.get('Affair').subscribe((res: string) =>{traAffair = res});
    this.translate.get('Message').subscribe((res: string) =>{traMessage = res});
    this.translate.get('Answer').subscribe((res: string) =>{traAnswer = res});
    this.translate.get('Enter').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('verifyInformation').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('ForMoreInformation').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});

    this.ticketServ.upResponTicketService( this.FormAnswerTicket.value, ticket.id_tic ).subscribe( (resp:any) =>{

      if(resp.ok){

        const json = {
          nombres: ticket.nombre_tic,
          apellidos: '',
          email: ticket.email_tic,
          asunto: `${traAsunto1} ${ticket.id_tic} ${traAsunto2}`,
          descripcion: `<p>${traDesc1}</p>
                        <p>${traTicket}: ${ticket.id_tic}</p>
                        <p>${traAffair}: ${ticket.asunto_tic}</p>
                        <p>${traMessage}: ${ticket.mensaje_tic}</p>
                        <p>${traAnswer}: ${this.FormAnswerTicket.get('respuesta').value}</p>
                        <br>
                        <p>${traDesc2}: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> ${traDesc3} Ticket</p>
                        <br>
                        <b>${traDesc4}</b>
                        <br>
                        <p>©${this.year} - ${traDesc5}</p>`,
        }

        this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{
          console.log(resp2)

        }, err => console.error(err))

        Swal.fire(`${traSuccess}`, resp.msg, 'success');
        this.getAllTickets();
        
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
    })

  }




  /**
   * Método para eliminar tickets
   * @param idTicket => ID Ticket
   */
  public eliminarTicket = (idTicket:any) =>{

    let traTitle;
    let traText;
    let traButton;
    let traSuccess;
    let traError;
    this.translate.get('deleteTicket').subscribe((res: string) =>{traTitle = res});
    this.translate.get('OnceDelRecovered').subscribe((res: string) =>{traText = res});
    this.translate.get('YesDelete').subscribe((res: string) =>{traButton = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});
    
    Swal.fire({
      title: `${traTitle} ${idTicket}?`,
      text: `${traText}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${traButton}`
    }).then((result) => {

      if (result.isConfirmed) {
        this.ticketServ.deleteTicketService(idTicket).subscribe( (resp:any) =>{
          
          Swal.fire(`${traSuccess}`, resp.msg, 'success');
          setTimeout(() => { window.location.reload() }, 1500);
        
        }, (err) =>{
          //En caso de un error
          Swal.fire(`${traError}`, err.error.msg, 'error');
        })
      }

    })
  }




  public campoNoValido = (campo:any): boolean =>{
    if ( this.FormAnswerTicket.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }
  


}
