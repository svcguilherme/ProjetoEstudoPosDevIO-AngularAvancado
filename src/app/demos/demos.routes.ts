import { Routes } from '@angular/router';
import { DemoHubComponent } from './demo-hub/demo-hub.component';
import { ErrorHandlingDemoComponent } from './error-handling/error-handling.component';
import { ViewChildDemoComponent } from './view-child/view-child-demo.component';
import { PipesDemoComponent } from './pipes/pipes-demo.component';
import { ProvidersDemoComponent } from './providers/providers-demo.component';
import { NgZonesDemoComponent } from './ngzones/ngzones-demo.component';
import { RxjsStateDemoComponent } from './rxjs-state/rxjs-state-demo.component';
import { FiltersDemoComponent } from './filters/filters-demo.component';

export const DEMO_ROUTES: Routes = [
  { path: '',              component: DemoHubComponent },
  { path: 'error-handling', component: ErrorHandlingDemoComponent },
  { path: 'view-child',    component: ViewChildDemoComponent },
  { path: 'pipes',         component: PipesDemoComponent },
  { path: 'providers',     component: ProvidersDemoComponent },
  { path: 'ngzones',       component: NgZonesDemoComponent },
  { path: 'rxjs-state',    component: RxjsStateDemoComponent },
  { path: 'filters',       component: FiltersDemoComponent },
];
