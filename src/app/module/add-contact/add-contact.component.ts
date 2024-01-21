import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
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
    nickName: [null,],
    name: [null, Validators.required,],
    mobile: [null, Validators.required],
    email: [null, [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    avatar: [null,],
    dob: [null],
    companyDetails: this._fb.group({
      company: [null,],
      department: [null,],
      title: [null,],
    }),
    groupId: [null],
    gender: [null,],
    age: [null],
    specialDatesGroup: this._fb.group({
      specialDates: [null,],
      label: [null,],
    }),
    customLinks: this._fb.array([]),
    language: [null,],
    height: [null,],
    address: this._fb.group({
      line1: [null,],
      line2: [null,],
      city: [null,],
      state: [null,],
      pinCode: [null,],
    })
  })

  groups: IGroup[] = [];
  genders = [
    { gen: 'male', icon: 'male' },
    { gen: 'female', icon: 'female' }]

  specialDatesLabel: string[] = ['Anniversary', 'Birthday']

  languages: string[] = [];

  contactsData?: IContact;
  selectedFile: File | null = null;
  contactId: string = '';
  imgBoolean: boolean = true;
  loading: boolean = false;

  addOnBlur = true;
  separatorKeysCodes = [13, 188]

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

  get languageControl(): FormArray {
    return this.contactForm.get('language') as FormArray
  }

  addLang(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our language
    if (value) {
      this.languages.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeLang(language: string): void {
    const index = this.languages.indexOf(language);
    if (index >= 0) {
      this.languages.splice(index)
    }
  }

  editLang(language: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    // Remove language if it no longer has a name
    if (!value) {
      this.removeLang(language);
      return;
    }
    // Edit existing language
    const index = this.languages.indexOf(language);
    if (index >= 0) {
      this.languages[index] = value;
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.getControls(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  validPattern(controlName: string): boolean {
    return !!this.getControls(controlName)?.hasError('pattern');
  }

  getControls(control: string) {
    return this.contactForm.get(control);
  }

  // get languageArrayControl(): FormArray {
  //   return this.contactForm.get('language') as FormArray;
  // }

  getAllGroups() {
    this._contactService.getAllGroups().subscribe({
      next: (res: any) => {
        this.groups = res;
      }
    })
  }

  changeRange(event: any, ref: HTMLInputElement) {
    ref.value = event.target.value;
  }

  patchData() {
    if (!this.contactsData) return;
    this.contactForm.patchValue(this.contactsData);
    const { language } = this.contactsData;
    this.languages = language
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
    // this.contactForm.markAllAsTouched();
    // if (this.contactForm.invalid) {
    //   this._snackBar.open('Atleast Fill Mandatory Fields', 'Dismiss', { duration: 2000, verticalPosition: 'bottom', })
    //   return;
    // }

    const requestValue = this.contactForm.getRawValue();
    console.log(requestValue);

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
