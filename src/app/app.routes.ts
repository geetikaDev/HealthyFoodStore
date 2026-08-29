import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Products } from './components/products/products';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Payment } from './components/payment/payment';
import { OrderSuccess } from './components/order-success/order-success';
import { authGuard } from './guards/auth-guard';
import { MyOrders } from './components/my-orders/my-orders';
import { ForgotPassword } from './components/forgot-password/forgot-password';

export const routes: Routes = [
    {path:'', redirectTo: 'home', pathMatch: 'full'},
    {path:'login', component:Login},
    {path:'register', component:Register},
    {path:'home', component:Home},
    {path:'products', component:Products},
    {path:'cart', component:Cart},
    {path:'checkout', component:Checkout, canActivate:[authGuard]},
    {path:'payment', component:Payment, canActivate:[authGuard]},
    {path:'order-success', component:OrderSuccess, canActivate:[authGuard]},
    {path:'my-orders', component:MyOrders},
    {path:'forgot-password', component:ForgotPassword}
];
