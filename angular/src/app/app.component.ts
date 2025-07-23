import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiAgentDashboardContainerComponent } from './components/ai-agent-dashboard/ai-agent-dashboard-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AiAgentDashboardContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI Agent Dashboard';
}