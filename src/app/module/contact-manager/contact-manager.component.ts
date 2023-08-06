import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivationStart, Router } from '@angular/router';
import { ContactService } from 'src/app/core/service/contact.service';
import { IContact } from 'src/app/core/models/contact-model';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-contact-manager',
  templateUrl: './contact-manager.component.html',
  styleUrls: ['./contact-manager.component.scss']
})
export class ContactManagerComponent implements OnInit {

  searchForm: FormGroup = this._fb.group({
    search: [null],
  })

  contacts: IContact[] = [];
  deletedContact!: IContact;
  loading: boolean = false;
  errorMessage: string = '';
  contactId: string = '';

  searchTerm: string = '';
  filteredItems: IContact[] = [];

  constructor(
    private _dialog: MatDialog,
    private _contactService: ContactService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getContacts();
  }

  filterResults(text: string) {
    this.filteredItems = this.contacts.filter(
      contact => contact?.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  getContacts() {
    this.loading = true;
    this._contactService.getContacts({ recycled: false }).subscribe({
      next: (res: any) => {
        this.contacts = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        // this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.filteredItems = this.contacts;
      },
    })
  }

  add() {
    this._dialog.open(AddContactComponent, {
      width: '50%',
    }).afterClosed().subscribe(val => {
      if (val) {
        this.getContacts();
      }
    })
  }

  edit(row: any) {
    this._dialog.open(AddContactComponent, {
      width: '50%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val) {
        this.getContacts();
      }
    })
  }

  moveToRecycle(id: string) {
    this._contactService.recycleContact(id, { recycled: true }).subscribe({
      next: (_res: any) => {
        this.getContacts();
        this._snackBar.open('Moved to Bin', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
      }
    });
  }

}
