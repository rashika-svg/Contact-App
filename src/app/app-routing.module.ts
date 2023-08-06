import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactManagerComponent } from './module/contact-manager/contact-manager.component';
import { AddContactComponent } from './module/add-contact/add-contact.component';
import { ViewContactComponent } from './module/view-contact/view-contact.component';
import { PageNotFoundComponent } from './module/page-not-found/page-not-found.component';
import { DeletedItemsComponent } from './module/deleted-items/deleted-items.component';

export const CONTACT_APP = [
  ContactManagerComponent,
  AddContactComponent,
  ViewContactComponent
];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/contacts/admin',
    pathMatch: 'full',
  },
  {
    path: 'contacts/admin',
    component: ContactManagerComponent
  },
  {
    path: 'contacts/add',
    component: AddContactComponent
  },
  {
    path: 'contacts/view/:id',
    component: ViewContactComponent
  },
  {
    path: 'contacts/admin',
    component: ContactManagerComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
