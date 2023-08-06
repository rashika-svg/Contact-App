import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, CONTACT_APP } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './module/navbar/navbar.component';
import { PageNotFoundComponent } from './module/page-not-found/page-not-found.component';
import { MaterialModule } from './module/shared/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletedItemsComponent } from './module/deleted-items/deleted-items.component';

@NgModule({
  declarations: [
    ...CONTACT_APP,
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    DeletedItemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
