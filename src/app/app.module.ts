import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CalendarDateFormatter, CalendarEventTitleFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component'; // Import FormsModule
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule for dialog
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for input fields
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule for datepicker
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule for date format
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule , NgxMatNativeDateModule} from '@angular-material-components/datetime-picker';
import { CalendarComponent } from './calendar/calendar.component';
import { ColorLegendComponent } from './color-legend/color-legend.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { UsercalendarComponent } from './usercalendar/usercalendar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';







registerLocaleData(localeFr, 'fr');

class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override dayViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
   }

  public override weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
   }
}

@NgModule({
  declarations: [
    AppComponent,
    AddEventModalComponent,
    CalendarComponent,
    ColorLegendComponent,
    UsercalendarComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    DatePipe,
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSlideToggleModule,
    MatRadioModule

    
 
    
    


  ],
  providers: [
    DatePipe,
    { provide: CalendarDateFormatter , useClass: CustomDateFormatter },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
