import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IContact } from 'src/app/core/models/contact-model';
import { IGroup } from 'src/app/core/models/group';
import { ContactService } from 'src/app/core/service/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})

export class AddContactComponent implements OnInit {
  contactForm: FormGroup = this._fb.group({
    name: [null, Validators.required,],
    mobile: [null, Validators.required],
    email: [null, Validators.required],
    avatar: [null, Validators.required],
    company: [null],
    groupId: [null],
    title: [null],
  })
  groups: IGroup[] = [];

  contactsData: IContact | undefined;
  selectedFile: File | null = null;
  contactId: string = '';
  imgBoolean: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _contactService: ContactService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) private _dialogData: any
  ) {
    this._dialogRef.disableClose = true;
    this.contactsData = this._dialogData;
  }

  ngOnInit() {
    this.patchData();
    this.getAllGroups();
  }

  getAllGroups() {
    this._contactService.getAllGroups().subscribe({
      next: (res: any) => {
        this.groups = res;
      }
    })
  }

  patchData() {
    if (!this.contactsData) return;
    this.contactForm.patchValue(this.contactsData);

  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (event: any) => {
        this.imgBoolean = false;
        this.selectedFile = event.target.result;
        this.contactForm.patchValue({ avatar: this.selectedFile })
      }
    }
  }


  submitForm() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      this._snackBar.open('Fill Mandatory Fields', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', })
      return;
    }

    const requestValue = this.contactForm.getRawValue();

    if (!this.contactsData) {
      this._contactService.createContact({ ...requestValue, recycled: false }).subscribe({
        next: (res: any) => {
          this._dialogRef.close({
            data: res,
          });
          this._snackBar.open('Contact added', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        },
        error: (err: any) => {
          this._snackBar.open(err, 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        },
      })
    } else {
      this._contactService.updateContact(this.contactsData?.id, requestValue).subscribe({
        next: (res: any) => {
          this._dialogRef.close({
            data: res,
          });
          this._snackBar.open('Contact updated', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        },
        error: (err: any) => {
          this._snackBar.open(err, 'Dismiss', { duration: 2000, verticalPosition: 'bottom', });
        },
      })
    }
  }
}
