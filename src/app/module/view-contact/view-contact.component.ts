import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IContact } from 'src/app/core/models/contact-model';
import { IGroup } from 'src/app/core/models/group';
import { ContactService } from 'src/app/core/service/contact.service';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss']
})
export class ViewContactComponent implements OnInit {
  contactID: string | null = null;
  contactData: IContact | undefined;
  loading: boolean = false;
  errorMessage: string = '';
  group: IGroup | undefined;

  constructor(public activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    ) {
    this.contactID = this.activatedRoute.snapshot.params?.['id'];
  }

  ngOnInit(): void {
    this.getContact(this.contactID);
  }

  getContact(id: any) {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (res: any) => {
        this.contactData = res;
        this.contactService.getGroup(res).subscribe((data: IGroup) => {
          this.group = data;
        })
      },
      error: (err: any) => {
        this.errorMessage = err;
      },
      complete: () => {
        this.loading = false
      }
    })
  }
}
