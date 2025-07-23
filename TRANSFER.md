# React to Angular Component Transformation Guide

## Project Overview

Transform React components to Angular following clean architecture principles with smart/dumb component pattern, TypeScript best practices, and preparation for future API integration.

## Transformation Prompt

````markdown
Transform the following React component to Angular using these architectural principles:

## Architecture Guidelines:

### 1. Component Separation Pattern

- **Smart Components (Container Components)**:

  - Handle data fetching and state management
  - Pass data down to dumb components via @Input()
  - Listen to events from dumb components via @Output()
  - Contain business logic
  - Typically have minimal template/styling

- **Dumb Components (Presentational Components)**:
  - Receive data through @Input() properties
  - Emit events through @Output() EventEmitters
  - Focus purely on presentation
  - Highly reusable
  - No direct API calls or business logic

### 2. Transformation Rules:

**React → Angular Mapping:**

- useState → Component properties with proper typing
- useEffect → ngOnInit, ngOnChanges, or ngOnDestroy
- props → @Input() decorators
- callbacks/event handlers → @Output() EventEmitter
- React.Fragment → ng-container
- map() for lists → \*ngFor
- conditional rendering → \*ngIf
- className → class or [class]
- onClick → (click)
- onChange → (change) or [(ngModel)]
- style prop → [style] or [ngStyle]

### 3. Code Structure Requirements:

**For Smart Components (Standalone):**

```typescript
@Component({
  selector: 'app-[name]-container',
  standalone: true,
  imports: [CommonModule, [Name]PresentationComponent],
  template: `
    <app-[name]-presentation
      [data]="processedData"
      (onAction)="handleAction($event)">
    </app-[name]-presentation>
  `
})
export class [Name]ContainerComponent implements OnInit {
  // State management
  // Business logic
  // Data preparation
}
```
````

**For Dumb Components (Standalone):**

```typescript
@Component({
  selector: 'app-[name]-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[name]-presentation.component.html',
  styleUrls: ['./[name]-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Name]PresentationComponent {
  @Input() data: DataType;
  @Output() onAction = new EventEmitter<ActionType>();

  // Only UI logic
}
```

### 4. Specific Requirements:

- Use TypeScript interfaces for all data types
- Implement proper lifecycle hooks instead of useEffect
- Use RxJS observables for async operations (prepare structure, but don't implement API calls)
- Follow Angular naming conventions (PascalCase for components, camelCase for properties)
- Use Angular's built-in directives (*ngFor, *ngIf, [ngClass], etc.)
- Implement proper change detection strategy for dumb components
- Add trackBy functions for \*ngFor when dealing with lists
- Use standalone components with explicit imports instead of NgModules
- Import only required dependencies in each component

### 5. Do NOT:

- Create any services for API calls (just prepare the component structure)
- Use any or unknown types (always define proper interfaces)
- Mix business logic in presentational components
- Use document or window directly (use Angular's Renderer2 if needed)
- Create NgModules (use standalone components instead)
- Import unnecessary dependencies in standalone components

### 6. Example Output Structure:

For each React component, provide:

1. Interface definitions (types.ts)
2. Smart/Container component (.ts file)
3. Dumb/Presentational component (.ts file)
4. Template file for presentational component (.html file)
5. Brief explanation of architectural decisions

Please transform the React component maintaining clean architecture and Angular best practices.

````

## Example Transformation

### Input: React Component
```jsx
import React, { useState, useEffect } from 'react';

const AgentList = ({ initialAgents, onAgentSelect }) => {
  const [agents, setAgents] = useState(initialAgents || []);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Will be replaced with API call later
    console.log('Component mounted');
  }, []);

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    onAgentSelect(agent);
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="agent-list">
      <input
        type="text"
        placeholder="Search agents..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filteredAgents.map(agent => (
          <li
            key={agent.id}
            className={selectedAgent?.id === agent.id ? 'selected' : ''}
            onClick={() => handleAgentClick(agent)}
          >
            {agent.name} - {agent.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
````

### Output: Angular Standalone Components

#### 1. types.ts

```typescript
export interface Agent {
  id: number;
  name: string;
  email: string;
}

export interface AgentListData {
  agents: Agent[];
  selectedAgent: Agent | null;
  filter: string;
}
```

#### 2. agent-list-container.component.ts (Smart Component)

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Agent, AgentListData } from "./types";
import { AgentListPresentationComponent } from "./agent-list-presentation.component";

@Component({
  selector: "app-agent-list-container",
  standalone: true,
  imports: [CommonModule, AgentListPresentationComponent],
  template: `
    <app-agent-list-presentation
      [agents]="agents"
      [selectedAgent]="selectedAgent"
      [filter]="filter"
      (filterChange)="onFilterChange($event)"
      (agentSelect)="onAgentSelect($event)"
    >
    </app-agent-list-presentation>
  `,
})
export class AgentListContainerComponent implements OnInit {
  @Input() initialAgents: Agent[] = [];
  @Output() agentSelected = new EventEmitter<Agent>();

  agents: Agent[] = [];
  selectedAgent: Agent | null = null;
  filter: string = "";

  ngOnInit(): void {
    this.agents = this.initialAgents;
    // Prepared for future API call
    console.log("Component mounted");
  }

  onFilterChange(filter: string): void {
    this.filter = filter;
  }

  onAgentSelect(agent: Agent): void {
    this.selectedAgent = agent;
    this.agentSelected.emit(agent);
  }
}
```

#### 3. agent-list-presentation.component.ts (Dumb Component)

```typescript
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Agent } from "./types";

@Component({
  selector: "app-agent-list-presentation",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./agent-list-presentation.component.html",
  styleUrls: ["./agent-list-presentation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentListPresentationComponent {
  @Input() agents: Agent[] = [];
  @Input() selectedAgent: Agent | null = null;
  @Input() filter: string = "";

  @Output() filterChange = new EventEmitter<string>();
  @Output() agentSelect = new EventEmitter<Agent>();

  get filteredAgents(): Agent[] {
    return this.agents.filter((agent) =>
      agent.name.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  onFilterInput(value: string): void {
    this.filterChange.emit(value);
  }

  onAgentClick(agent: Agent): void {
    this.agentSelect.emit(agent);
  }

  trackByAgentId(index: number, agent: Agent): number {
    return agent.id;
  }
}
```

#### 4. agent-list-presentation.component.html

```html
<div class="agent-list">
  <input
    type="text"
    placeholder="Search agents..."
    [value]="filter"
    (input)="onFilterInput($event.target.value)"
    class="search-input"
  />

  <ul class="agent-list__items">
    <li
      *ngFor="let agent of filteredAgents; trackBy: trackByAgentId"
      [class.selected]="selectedAgent?.id === agent.id"
      (click)="onAgentClick(agent)"
      class="agent-list__item"
    >
      {{ agent.name }} - {{ agent.email }}
    </li>
  </ul>
</div>
```

#### 5. Architecture Decisions:

- Separated business logic (container) from presentation (presentation component)
- Used standalone Angular components instead of NgModules for better tree-shaking and simpler structure
- Used OnPush change detection for better performance in presentational component
- Implemented trackBy for optimal list rendering
- Prepared structure for future Observable-based data flow
- Used proper TypeScript interfaces for type safety
- Event emitters handle all upward communication
- Each component explicitly imports its dependencies for better bundling

## Additional Guidelines

### Folder Structure (Standalone Components)

```
src/app/
├── components/
│   ├── agent-list/
│   │   ├── agent-list-container.component.ts
│   │   ├── agent-list-presentation.component.ts
│   │   ├── agent-list-presentation.component.html
│   │   ├── agent-list-presentation.component.scss
│   │   └── types.ts
```

### Standalone Component Usage

With standalone components, you can directly import and use them without NgModules:

```typescript
// In your parent component or main.ts
import { AgentListContainerComponent } from "./components/agent-list/agent-list-container.component";

// Use directly in imports array of another standalone component
@Component({
  selector: "app-main",
  standalone: true,
  imports: [AgentListContainerComponent],
  template: `
    <app-agent-list-container
      [initialAgents]="agentData"
      (agentSelected)="onAgentSelected($event)"
    >
    </app-agent-list-container>
  `,
})
export class MainComponent {
  // ...
}
```

### Best Practices Checklist

- [ ] All data types are properly defined with interfaces
- [ ] Smart components handle all business logic
- [ ] Dumb components only handle presentation
- [ ] OnPush change detection for presentational components
- [ ] TrackBy functions for all \*ngFor loops
- [ ] Proper event emitters for child-to-parent communication
- [ ] No direct API calls (structure prepared for future implementation)
- [ ] Following Angular naming conventions
- [ ] Proper lifecycle hook usage
- [ ] Clean separation of concerns

## Notes for Implementation

- Don't create any services even calling no need to implement
- Only wirefram style and mockup actions.
- Consider using RxJS operators for complex data transformations
- Add error handling and loading states in smart components
- Implement unit tests for both smart and dumb components separately
- Use Angular CDK/Material for UI components when applicable
- Leverage standalone components for better tree-shaking and simpler dependency management
- Use the `inject()` function for dependency injection in standalone components when needed
