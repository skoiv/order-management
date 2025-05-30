import { Routes } from '@angular/router';
import { OrderFormComponent } from './components/order-form/order-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/orders/create', pathMatch: 'full' },
  { path: 'orders/create', component: OrderFormComponent },
  { path: '**', redirectTo: '' },
];
