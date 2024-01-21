import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IContact } from 'src/app/core/models/contact-model';
import { ContactService } from 'src/app/core/service/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deleted-items',
  templateUrl: './deleted-items.component.html',
  styleUrls: ['./deleted-items.component.scss']
})
export class DeletedItemsComponent implements OnInit {

  contacts: IContact[] = [];
  errorMessage: string = '';
  contactId: string = '';

  constructor(
    private _contactService: ContactService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this._contactService.getContacts({ recycled: true }).subscribe({
      next: (res: any) => {
        this.contacts = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
      },
    })
  }

  restore(id: string) {
    this._contactService.recycleContact(id, { recycled: false }).subscribe({
      next: (res: any) => {
        this._snackBar.open('Restored', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        this.getContacts();
      },
    })
  }

  delete(templateRef: TemplateRef<any>, id: string) {
    this.contactId = id;
    this._dialog.open(templateRef, { width: '15%', }).afterClosed().subscribe(val => {
      if (val) { this.deleteContact() };
    })
  }

  deleteContact() {
    this._contactService.deleteContact(this.contactId).subscribe({
      next: (_res: any) => {
        this._snackBar.open('Deleted', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        this.getContacts();
      }
    });
  }

}
