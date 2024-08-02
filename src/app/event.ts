import { DatePipe } from "@angular/common";
import { CalendarEvent } from "angular-calendar";


const datePipe = new DatePipe('en-US');


export function customToSpe(CustomCalendarEvent: any): CalendarEvent {
    console.log('CustomCalendarEvent:', CustomCalendarEvent);
    return {
        id: CustomCalendarEvent.id,
        title: CustomCalendarEvent.title,
        color: CustomCalendarEvent.color,
        description: CustomCalendarEvent.description,
        category: CustomCalendarEvent.category,
        isCompleted : CustomCalendarEvent.isCompleted,
        userIds : CustomCalendarEvent.userIds,
        responsibleUserId : CustomCalendarEvent.responsibleUserId,
        start: datePipe.transform(CustomCalendarEvent.start, 'yyyy-MM-ddTHH:mm:ss') ?? CustomCalendarEvent.start.toISOString().substring(0, 19),
        end: datePipe.transform(CustomCalendarEvent.end, 'yyyy-MM-ddTHH:mm:ss') ?? CustomCalendarEvent.end.toISOString().substring(0, 19),
        

    };
}




