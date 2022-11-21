import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FestivalsComponent } from './festivals/festivals.component';
import { ApiModule, Configuration } from 'src/generated/openapi';
import {environment} from "../../environments/environment";
import { HttpClientModule } from '@angular/common/http';
import { FestivalsService } from './festivals.service';
import { TreeComponent } from './tree/tree.component';


@NgModule({
  providers: [
    FestivalsService
  ],
  declarations: [
    FestivalsComponent,
    TreeComponent  
  ],
  imports: [
    CommonModule,
    ApiModule.forRoot(() => new Configuration({
      basePath: environment.baseFestivalApiUrl 
    })),
    HttpClientModule
  ],
  exports: [
    FestivalsComponent
  ]
})
export class FestivalsModule { }
