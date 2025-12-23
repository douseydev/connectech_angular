import { Component, OnInit } from '@angular/core';
import { ConfirmService, ConfirmData } from '../../services/confirm.service';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
    data: ConfirmData | null = null;

    constructor(private confirmService: ConfirmService) { }

    ngOnInit(): void {
        this.confirmService.confirm$.subscribe(d => {
            this.data = d;
        });
    }

    handleAction(result: boolean) {
        if (this.data) {
            this.confirmService.close(result, this.data);
        }
    }
}
