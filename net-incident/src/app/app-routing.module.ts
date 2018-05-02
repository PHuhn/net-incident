// ===========================================================================
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//
import { AboutComponent } from './public/about/about.component';
import { ContactComponent } from './public/contact/contact.component';
import { HelpComponent } from './public/help/help.component';
import { TestingComponent } from './public/testing/testing.component';
//
const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contacts', component: ContactComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
//
//const routesx: Routes = [ { path: '', children: [] } ];
//
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// ===========================================================================
