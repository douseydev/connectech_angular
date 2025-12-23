import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    resolve?: (result: boolean) => void;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {
    private confirmSubject = new Subject<ConfirmData | null>();
    confirm$ = this.confirmSubject.asObservable();

    confirm(title: string, message: string, confirmText: string = 'Supprimer', cancelText: string = 'Annuler'): Promise<boolean> {
        return new Promise((resolve) => {
            this.confirmSubject.next({
                title,
                message,
                confirmText,
                cancelText,
                resolve
            });
        });
    }

    close(result: boolean, data: ConfirmData) {
        this.confirmSubject.next(null);
        if (data.resolve) {
            data.resolve(result);
        }
    }
}
