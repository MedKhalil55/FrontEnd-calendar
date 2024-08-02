import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddEventModalComponent } from '../add-event-modal/add-event-modal.component';
import { isSameDay, isSameMonth } from 'date-fns';
import { EventService } from '../service/event.service';
import { customToSpe } from '../event';
import { DatePipe } from '@angular/common';
import { AuthServiceService } from '../service/auth-service.service';


@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  
})
export class CalendarComponent implements OnInit{

  title = 'calendar-test';
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  Calendarview = CalendarView;

  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh = new Subject<void>();
  profileInfo : any;
  errorMessage : any;
  isAuthenticated : boolean = false;
  isAdmin : boolean = false;
  isUser : boolean = false;
  users: any[] = [];  // a property to store the list of users
  selectedUsers: number = 0;  // Add a property to store selected users
  completed : string ="all";


  constructor(public dialog: MatDialog, private eventService: EventService , private datePipe: DatePipe , private userService:AuthServiceService) {}

  async ngOnInit() {
    try{
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error("No Token Found")
      }
      this.isAuthenticated = this.userService.isAuthenticated();
      this.isAdmin = this.userService.isAdmin();
      this.isUser = this.userService.isUser();


      console.log("user : " +this.isUser);
      console.log("admin : "+this.isAdmin);

      if(this.isUser){
        this.loadEventsForUser(token);
      }
      else{
       this.loadEvents();        
      }

      // Fetch the list of users
      this.users = await this.userService.getAllUsers(token);
      console.log("users : " +this.users);
  
    }
    catch(error:any){
      this.showError(error.message);

    }
  }
  logout() : void {
    this.userService.logout();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }

  onUserChange() {

    if (this.selectedUsers === 0) {
      this.loadEvents();
    } else {
      this.loadEventsByUserId(this.selectedUsers);
    }
    console.log(this.selectedUsers);

  }



  showError(mess:string){
    this.errorMessage = mess;
    setTimeout(()=>{
      this.errorMessage = ''
    }, 3000)
  }

    

  //load all the events for the admin
  loadEvents() {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.map(event => this.mapToCalendarEvent(event));
      this.refresh.next();
    });
  }
//load all the events for the user connected
loadEventsForUser(token : string){
    this.eventService.getEventsForCurrentUser(token).subscribe(events => {
      this.events = events.map(event => this.mapToCalendarEvent(event));
      this.refresh.next();
    });
  }
//get the events of the userselected an admin
loadEventsByUserId(id: number) {
  if (id != 0) {
    this.eventService.getEventsForCurrentUserId(id).subscribe(events => {
      this.events = events.map(event => this.mapToCalendarEvent(event));
      this.refresh.next();
    });
  
  } else {
    this.loadEvents();
  }
}

loadCompletedEvents(token: string) {
  this.eventService.getCompletedEvents(token).subscribe(events => {
    this.events = events.map(event => this.mapToCalendarEvent(event));
    this.refresh.next();
  });
}

loadNonCompletedEvents(token: string) {
  this.eventService.getInCompletedEvents(token).subscribe(events => {
    this.events = events.map(event => this.mapToCalendarEvent(event));
    this.refresh.next();
  });
}
loadCompletedEventsByUser(id : number) {
  this.eventService.getCompletedEventsForUserId(id).subscribe(events => {
    this.events = events.map(event => this.mapToCalendarEvent(event));
    this.refresh.next();
  });
}
loadNonCompletedEventsByUser(id : number) {
  this.eventService.getInCompletedEventsForUserId(id).subscribe(events => {
    this.events = events.map(event => this.mapToCalendarEvent(event));
    this.refresh.next();
  });
}


onFilterChange() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.showError("No Token Found");
    return;
  }

  if (this.completed === 'all') {
    this.onUserChange();
  } else if (this.completed === 'completed') {
    if (this.selectedUsers != 0) {
      this.loadCompletedEventsByUser(this.selectedUsers);

    } else {
      this.loadCompletedEvents(token);

    }
  } else if (this.completed === 'notcompleted') {
    if (this.selectedUsers != 0) {
      this.loadNonCompletedEventsByUser(this.selectedUsers);

    } else {
      this.loadNonCompletedEvents(token);

    }
  }
}




  mapToCalendarEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      title: event.title,
      start: new Date(event.startDateTime),
      description : event.description,
      category : event.category,
      isCompleted : event.isCompleted,
      userIds : event.userIds,
      responsibleUserId : event.responsibleUserId,
      end: new Date(event.endDateTime),
      color: this.getCategoryColor(event.category),
    
      
    };
  }

  getCategoryColor(category: string): any {
    switch (category) {
      case 'category1':
        return { primary: '#1e90ff', secondary: '#D1E8FF' };
      case 'category2':
        return { primary: '#32CD32', secondary: '#C3FDB8' };
      case 'category3':
        return { primary: '#FFA500', secondary: '#FFE4B5' };
      default:
        return { primary: '#1e90ff', secondary: '#D1E8FF' };
    }
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log(this.selectedUsers);
    console.log(event);
    let khlil = customToSpe(event);
    let res = {
      id: khlil.id,
      title: khlil.title,
      description: khlil.description,
      startDateTime: khlil.start,  
      endDateTime: khlil.end,
      isCompleted : khlil.isCompleted,
      userIds : khlil.userIds,
      responsibleUserId : khlil.responsibleUserId,
      category: khlil.category,
     
    };
    console.log("khalil : "+khlil.start);
    const dialogRef = this.dialog.open(AddEventModalComponent, {
      width: '400px',
      data: { event: res }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          const token = localStorage.getItem('token')
          if(!token){
            throw new Error("No Token Found")
          }
              this.eventService.deleteEvent(event.id as number , token).subscribe(() => {
            this.events = this.events.filter(e => e !== event);
            this.refresh.next();
          });
        } else if (result.event) {
          if (result.isEditMode) {
            this.eventService.updateEvent(event.id as number, result.event).subscribe(updatedEvent => {
              const index = this.events.findIndex(e => e === event);
              if (index > -1) {
                this.events[index] = this.mapToCalendarEvent(updatedEvent);
              }
              this.refresh.next();
            });
          } else {
            this.eventService.createEvent(result.event).subscribe(newEvent => {
              this.events.push(this.mapToCalendarEvent(newEvent));
              this.refresh.next();
            });
          }
        }
      }
    });
  }

  eventTimesChanged(event: any): void {
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.eventService.updateEvent(event.event.id, event.event).subscribe(() => {
      this.refresh.next();
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(AddEventModalComponent, {
      width: '400px',
      data: { event:null  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event) {
        this.eventService.createEvent(result.event).subscribe(newEvent => {
          this.events.push(this.mapToCalendarEvent(newEvent));
          this.refresh.next();
        });
      }
    });
  }
}
