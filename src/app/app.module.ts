import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from "@angular/fire/compat/storage";

import { environment  } from '../environments/environment';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { FbTimestampPipe } from './pipes/fb-timestamp.pipe';
import { ClipService } from './services/clip.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'clip/:id', component: ClipComponent, resolve: { clip: ClipService } },

  { path: '', loadChildren: async () => (await import('./video/video.module')).VideoModule },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    ClipComponent,
    NotFoundComponent,
    ClipsListComponent,
    FbTimestampPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    UserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // Firebase authentication service.
    AngularFirestoreModule, // Angular firestore db module.
    AngularFireStorageModule, // Angular firebase helper module.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
