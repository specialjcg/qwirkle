import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AngularSvgIconModule} from "angular-svg-icon";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

const materialModules = [
    BrowserModule,
    NgxPanZoomModule,
    MatButtonModule,
    HttpClientModule,
    DragDropModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    RouterTestingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
];
@NgModule({
    imports: [CommonModule, ...materialModules,AngularSvgIconModule.forRoot(),],
    exports: [...materialModules]
})
export class AngularMaterialModule {}
