import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListOfCallsComponent } from './components/list-of-calls/list-of-calls.component';
import { ModalComponent } from './components/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteModalComponent } from './components/confirm-delete-modal/confirm-delete-modal.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ApiMockAngularInMemoryWebApiService } from './shared/services/api-mock/api-mock-angular-in-memory-web-api.service';

@NgModule({
  declarations: [
    AppComponent,
    ListOfCallsComponent,
    ModalComponent,
    ConfirmDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(ApiMockAngularInMemoryWebApiService),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
