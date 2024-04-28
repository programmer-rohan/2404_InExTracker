import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MaterialModule } from './material/material.module';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialModule,
    PageHeaderComponent,
    SideNavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'UI';
  menuClicked: boolean = true;
}
