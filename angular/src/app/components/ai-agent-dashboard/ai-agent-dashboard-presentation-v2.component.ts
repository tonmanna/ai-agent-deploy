import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Collection, 
  Agent, 
  PrimaryAgent,
  DashboardData, 
  ModalStates, 
  EditingStates, 
  ViewType,
  NewAgent,
  NewCollection,
  Document
} from './types';

// Import all the smaller components
import { AgentCardComponent } from './components/agent-card/agent-card.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { ModalBaseComponent } from './components/shared/modal-base.component';
import { EditAgentModalComponent } from './components/modals/edit-agent-modal.component';
import { DeleteConfirmationModalComponent } from './components/modals/delete-confirmation-modal.component';
import { AgentFormComponent } from './components/forms/agent-form.component';

@Component({
  selector: 'app-ai-agent-dashboard-presentation-v2',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AgentCardComponent,
    CollectionCardComponent,
    ModalBaseComponent,
    EditAgentModalComponent,
    DeleteConfirmationModalComponent,
    AgentFormComponent
  ],
  templateUrl: './ai-agent-dashboard-presentation-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentDashboardPresentationV2Component {
  @Input() dashboardData!: DashboardData;
  @Input() modalStates!: ModalStates;
  @Input() editingStates!: EditingStates;

  @Output() viewChange = new EventEmitter<ViewType>();
  @Output() openCreateModal = new EventEmitter<string>();
  @Output() createAgent = new EventEmitter<void>();
  @Output() toggleCollection = new EventEmitter<number>();
  @Output() deleteAgent = new EventEmitter<Agent>();
  @Output() editAgent = new EventEmitter<Agent>();
  @Output() editPrompt = new EventEmitter<{ agent: Agent, isPrimary?: boolean }>();
  @Output() createCollection = new EventEmitter<void>();
  @Output() viewCollection = new EventEmitter<Collection>();
  @Output() editCollection = new EventEmitter<Collection>();
  @Output() deleteCollection = new EventEmitter<Collection>();
  @Output() closeModal = new EventEmitter<string>();
  @Output() saveEditAgent = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<'agent' | 'collection'>();
  @Output() updateNewAgent = new EventEmitter<{field: keyof NewAgent, value: any}>();

  trackByAgentId(index: number, agent: Agent): string | number {
    return agent.id;
  }

  trackByCollectionId(index: number, collection: Collection): number {
    return collection.id;
  }

  getNavButtonClass(view: ViewType): string {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors flex items-center';
    const activeClass = 'bg-blue-50 text-blue-700';
    const inactiveClass = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
    
    return `${baseClass} ${this.dashboardData.activeView === view ? activeClass : inactiveClass}`;
  }

  getPageTitle(): string {
    return this.dashboardData.activeView === 'dashboard' 
      ? 'Agent Organization Chart' 
      : 'Collection Management';
  }

  canCreateAgent(): boolean {
    return !!(this.editingStates.newAgent.name && this.editingStates.selectedCollections.length > 0);
  }

  onViewChange(view: ViewType): void {
    this.viewChange.emit(view);
  }

  onOpenCreateModal(agentType: string): void {
    this.openCreateModal.emit(agentType);
  }

  onCreateAgent(): void {
    this.createAgent.emit();
  }

  onToggleCollection(collectionId: number): void {
    this.toggleCollection.emit(collectionId);
  }

  onClearCollectionSelection(): void {
    // Emit toggle for each selected collection to clear them
    this.editingStates.selectedCollections.forEach(id => {
      this.toggleCollection.emit(id);
    });
  }

  onDeleteAgent(agent: Agent): void {
    this.deleteAgent.emit(agent);
  }

  onEditAgent(agent: Agent): void {
    this.editAgent.emit(agent);
  }

  onEditPrompt(agent: Agent | PrimaryAgent, isPrimary = false): void {
    const agentData = 'subAgents' in agent ? 
      { ...agent, collections: [], status: 'active', isDefault: false, isPrimary: true } as Agent :
      agent as Agent;
    this.editPrompt.emit({ agent: agentData, isPrimary });
  }

  onViewCollection(collection: Collection): void {
    this.viewCollection.emit(collection);
  }

  onEditCollection(collection: Collection): void {
    this.editCollection.emit(collection);
  }

  onDeleteCollection(collection: Collection): void {
    this.deleteCollection.emit(collection);
  }

  onCloseModal(modalType: string): void {
    this.closeModal.emit(modalType);
  }

  onSaveEditAgent(): void {
    this.saveEditAgent.emit();
  }

  onConfirmDelete(type: 'agent' | 'collection'): void {
    this.confirmDelete.emit(type);
  }

  onUpdateNewAgent(field: keyof NewAgent, value: any): void {
    this.updateNewAgent.emit({ field, value });
  }
}