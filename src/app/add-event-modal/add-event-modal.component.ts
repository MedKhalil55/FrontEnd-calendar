import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../service/event.service';
import { DatePipe } from '@angular/common';
import { AuthServiceService } from '../service/auth-service.service';


@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss']
})
export class AddEventModalComponent implements OnInit {
  event: any;
  isEditMode = false;
  form: FormGroup;
  users : any[] = [];
  userIds : any[] = [];
  isAuthenticated : boolean = false;
  isAdmin : boolean = false;
  isUser : boolean = false;
  isResponsible : boolean = false;
  profile : any;
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private authService : AuthServiceService
  ) {
    this.event = data.event ? { ...data.event } : this.initializeNewEvent();
    this.isEditMode = !!data.event;
    this.form = this.fb.group({
      title: [this.event.title, Validators.required],
      description: [this.event.description],
      startDateTime: [this.event.startDateTime, Validators.required],
      endDateTime: [this.event.endDateTime, Validators.required],
      isCompleted: [this.event.isCompleted || false], 
      userIds : [this.event.userIds],
      responsibleUserId : [this.event.responsibleUserId],
      category: [this.event.category, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // Fetch all users to display in the dropdown
    
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.isUser = this.authService.isUser();


    const token = localStorage.getItem('token');
    if (token) {
      this.users = await this.authService.getAllUsers(token);
      this.profile = await this.authService.getProfile(token);
    }
    console.log(this.profile);
    console.log(this.profile.id); // This will log the id of the profile


    this.isResponsible =  this.checkIfResponsible();
    this.checkIfResponsible();
  

    if (this.isAuthenticated && this.isUser && !this.isEditMode) {
      // Update the userIds form control with the current user's ID
      // Assuming userIds is meant to hold an array of IDs, wrap the single ID in an array
      this.form.patchValue({
        userIds: [this.profile.id] ,
        responsibleUserId: this.profile.id // Wrap the id in an array since userIds expects an array
      });
    }


  }

  initializeNewEvent() {
    return {
      title: '',
      description: '',
      startDateTime: new Date().toISOString().substring(0, 16),
      endDateTime: new Date().toISOString().substring(0, 16),
      isCompleted : false,
      userIds : [],
      responsibleUserId : 0,
      category: 'category1'
    };
  }

  onToggleChange(isChecked: boolean): void {
    if (this.isAuthenticated && this.isUser && this.isResponsible) {
      this.form.patchValue({ isCompleted: isChecked });
    }
  }
  
  checkIfResponsible() {
    if (this.isAuthenticated && this.isUser) {
      this.isResponsible = this.profile.id === this.form.value.responsibleUserId;
      console.log("the responsible ",this.form.value.responsibleUserId);

      return this.isResponsible;
    }
    console.log("the responsible ",this.form.value.responsibleUserId);
    return false;
  }



  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    console.log(this.users);
    console.log("selectedusers" + this.userIds);
  
    if (this.form.invalid || this.isInvalidDateOrder()) {
      return; // Prevent saving if form is invalid or dates are out of order
    }
  
    const datePipe = new DatePipe('en-US');
    const title = this.form.value.title;
    const description = this.form.value.description;
    const startDateTime = datePipe.transform(this.form.value.startDateTime, 'yyyy-MM-ddTHH:mm:ss') ?? this.form.value.startDateTime.toISOString().substring(0, 19);
    const endDateTime = datePipe.transform(this.form.value.endDateTime, 'yyyy-MM-ddTHH:mm:ss') ?? this.form.value.endDateTime.toISOString().substring(0, 19);
    const isCompleted = this.form.value.isCompleted;
    const userIds = this.form.value.userIds;
    let responsibleUserId = this.form.value.responsibleUserId;
    const category = this.form.value.category;
    const color = this.getCategoryColor(this.form.value.category);
    
    // Set responsibleUserId to 0 if it's null or undefined
    if (!responsibleUserId) {
      responsibleUserId = { id: 0 };
    }
    
    console.log("start date time save: " + typeof (startDateTime));
    console.log(startDateTime);
  
    const newEvent = {
      ...this.event,  // Preserve existing properties like id
      title: title,
      description: description,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      isCompleted: isCompleted,
      userIds: userIds,
      responsibleUserId: responsibleUserId,
      category: category,
      color: color
    };
  
    if (this.isEditMode) {
      this.eventService.updateEvent(this.event.id, newEvent).subscribe(res => {
        res.startDateTime = res.startDateTime.toString();
        console.log("the start date : " + res.startDateTime);
        this.dialogRef.close({ event: res, isEditMode: this.isEditMode });
        console.log(this.event.id);
      });
    } else {
      this.eventService.createEvent(newEvent).subscribe(res => {
        console.log("added recently : " + res);
        this.dialogRef.close({ event: res, isEditMode: this.isEditMode });
      });
    }
  
    console.log("hello" ,this.form.value); // Add this line to log the entire form value
  }
    onDeleteClick(): void {
    this.dialogRef.close({ delete: true, event: this.event });
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

  isInvalidDateOrder(): boolean {
    const startDateTime = new Date(this.form.value.startDateTime);
    const endDateTime = new Date(this.form.value.endDateTime);
    return startDateTime >= endDateTime;
  }
  isResponsibleValid(): boolean {
    const responsibleUserId = this.form.value.responsibleUserId;
    const userIdsArray = this.form.value.userIds;
    return userIdsArray.includes(responsibleUserId);
  }
  }
