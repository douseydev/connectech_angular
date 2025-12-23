import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    show: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<Notification>({
        message: '',
        type: 'success',
        show: false
    });

    notification$ = this.notificationSubject.asObservable();

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
        this.notificationSubject.next({ message, type, show: true });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hide();
        }, 5000);
    }

    hide() {
        this.notificationSubject.next({ ...this.notificationSubject.value, show: false });
    }
}
