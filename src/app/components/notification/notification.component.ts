import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    notification: Notification = { message: '', type: 'success', show: false };

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.notificationService.notification$.subscribe(notif => {
            this.notification = notif;
        });
    }

    close() {
        this.notificationService.hide();
    }
}
