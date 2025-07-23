import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiAgentDashboardContainerComponent } from './components/ai-agent-dashboard/ai-agent-dashboard-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AiAgentDashboardContainerComponent],
  template: `
    <div class="app-container">
      <app-ai-agent-dashboard-container></app-ai-agent-dashboard-container>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      width: 100%;
    }
  `]
})
export class AppComponent {
  title = 'AI Agent Dashboard';
}