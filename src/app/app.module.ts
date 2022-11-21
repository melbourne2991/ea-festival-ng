import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FestivalsModule } from './festivals/festivals.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FestivalsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
