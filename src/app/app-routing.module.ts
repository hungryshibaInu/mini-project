import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WikiComponent } from './wiki/wiki.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { WikiContentComponent } from './wiki/wiki-content/wiki-content.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../app/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'wiki',
    component: WikiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'wiki/snack-content',
    component: WikiContentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
