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

@Component({
  selector: 'app-ai-agent-dashboard-presentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-agent-dashboard-presentation.component.html',
  styleUrls: ['./ai-agent-dashboard-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentDashboardPresentationComponent {
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
  @Output() fileUpload = new EventEmitter<{ collectionId: number, files: FileList }>();
  @Output() deleteDocument = new EventEmitter<{ collectionId: number, documentId: string }>();
  @Output() closeModal = new EventEmitter<string>();
  @Output() saveEditAgent = new EventEmitter<void>();
  @Output() saveEditCollection = new EventEmitter<void>();
  @Output() savePrompt = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<'agent' | 'collection'>();
  @Output() updateNewAgent = new EventEmitter<Partial<NewAgent>>();
  @Output() updateNewCollection = new EventEmitter<Partial<NewCollection>>();
  @Output() updateEditingCollection = new EventEmitter<Partial<Collection>>();
  @Output() updatePromptText = new EventEmitter<string>();

  getFileIcon(type: string): string {
    const icons: { [key: string]: string } = {
      pdf: '📄',
      docx: '📝',
      xlsx: '📊',
      md: '📋',
      txt: '📃'
    };
    return icons[type] || '📎';
  }

  getCollectionName(collectionId: number): string {
    const collection = this.dashboardData.collections.find(c => c.id === collectionId);
    return collection ? collection.name : '';
  }

  trackByAgentId(index: number, agent: Agent): string | number {
    return agent.id;
  }

  trackByCollectionId(index: number, collection: Collection): number {
    return collection.id;
  }

  trackByDocumentId(index: number, document: Document): string {
    return document.id;
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

  onCreateCollection(): void {
    this.createCollection.emit();
  }

  onViewCollection(collection: Collection): void {
    this.viewCollection.emit(collection);
  }

  onEditCollection(collection: Collection, event: Event): void {
    event.stopPropagation();
    this.editCollection.emit(collection);
  }

  onDeleteCollection(collection: Collection, event: Event): void {
    event.stopPropagation();
    this.deleteCollection.emit(collection);
  }

  onFileUpload(collectionId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.fileUpload.emit({ collectionId, files: target.files });
    }
  }

  onDeleteDocument(collectionId: number, documentId: string): void {
    this.deleteDocument.emit({ collectionId, documentId });
  }

  onCloseModal(modalType: string): void {
    this.closeModal.emit(modalType);
  }

  onSaveEditAgent(): void {
    this.saveEditAgent.emit();
  }

  onSaveEditCollection(): void {
    this.saveEditCollection.emit();
  }

  onSavePrompt(): void {
    this.savePrompt.emit();
  }

  onConfirmDelete(type: 'agent' | 'collection'): void {
    this.confirmDelete.emit(type);
  }

  onUpdateNewAgent(field: keyof NewAgent, value: any): void {
    this.updateNewAgent.emit({ [field]: value });
  }

  onUpdateNewCollection(field: keyof NewCollection, value: string): void {
    this.updateNewCollection.emit({ [field]: value });
  }

  onUpdateEditingCollection(field: keyof Collection, value: any): void {
    this.updateEditingCollection.emit({ [field]: value });
  }

  onUpdatePromptText(text: string): void {
    this.updatePromptText.emit(text);
  }

  isCollectionSelected(collectionId: number): boolean {
    return this.editingStates.selectedCollections.includes(collectionId);
  }

  canCreateAgent(): boolean {
    return !!(this.editingStates.newAgent.name && this.editingStates.selectedCollections.length > 0);
  }

  canCreateCollection(): boolean {
    return !!(this.editingStates.newCollection.name && this.editingStates.newCollection.detail);
  }

  canSaveEditCollection(): boolean {
    return !!(this.editingStates.editingCollection?.name && this.editingStates.editingCollection?.detail);
  }

  getAgentsUsingCollection(collectionId: number): Agent[] {
    const agentsUsingCollection: Agent[] = [];
    
    this.dashboardData.agents.internal.subAgents.forEach(agent => {
      if (agent.collections.includes(collectionId)) {
        agentsUsingCollection.push(agent);
      }
    });
    
    this.dashboardData.agents.customer.subAgents.forEach(agent => {
      if (agent.collections.includes(collectionId)) {
        agentsUsingCollection.push(agent);
      }
    });
    
    return agentsUsingCollection;
  }
}