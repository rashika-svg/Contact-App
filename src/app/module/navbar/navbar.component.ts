import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletedItemsComponent } from '../deleted-items/deleted-items.component';
import { ContactService } from 'src/app/core/service/contact.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private _dialog: MatDialog) { }


  deletedItems() {
    this._dialog.open(DeletedItemsComponent, {
      width: '50%',
    }).afterClosed().subscribe(data => {
      window.location.reload();
    })
  }
}
