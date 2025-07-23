import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Collection, 
  Agent, 
  AgentData, 
  DashboardData, 
  ModalStates, 
  EditingStates, 
  ViewType,
  NewAgent,
  NewCollection,
  Document
} from './types';
import { AiAgentDashboardPresentationV2Component } from './ai-agent-dashboard-presentation-v2.component';

@Component({
  selector: 'app-ai-agent-dashboard-container',
  standalone: true,
  imports: [CommonModule, AiAgentDashboardPresentationV2Component],
  templateUrl: './ai-agent-dashboard-container.component.html'
})
export class AiAgentDashboardContainerComponent implements OnInit {
  dashboardData: DashboardData = {
    activeView: 'dashboard',
    collections: [],
    agents: {
      internal: {
        name: 'Internal Agent',
        id: 'internal-primary',
        prompt: 'You are an internal assistant helping employees with company-related tasks, policies, and procedures.',
        subAgents: []
      },
      customer: {
        name: 'Customer Agent',
        id: 'customer-primary',
        prompt: 'You are a customer service assistant focused on helping customers with their inquiries and providing excellent support.',
        subAgents: []
      }
    },
    selectedCollection: null,
    selectedAgent: null
  };

  modalStates: ModalStates = {
    showCreateModal: false,
    showPromptModal: false,
    showDeleteModal: false,
    showCreateCollectionModal: false,
    showCollectionDetailsModal: false,
    showEditAgentModal: false,
    showDeleteCollectionModal: false,
    showEditCollectionModal: false
  };

  editingStates: EditingStates = {
    editingCollection: null,
    collectionToDelete: null,
    agentToDelete: null,
    editingAgent: null,
    selectedCollections: [],
    newAgent: { name: '', type: '', collections: [] },
    newCollection: { name: '', detail: '' },
    promptText: ''
  };

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize sample collections
    this.dashboardData.collections = [
      { 
        id: 1, 
        name: 'Customer Support Vector Store', 
        detail: 'Contains customer support documentation, FAQs, and troubleshooting guides',
        documents: [
          { id: 'd1', name: 'FAQ_Guide.pdf', type: 'pdf', size: '2.4 MB' },
          { id: 'd2', name: 'Support_Manual.docx', type: 'docx', size: '1.8 MB' },
        ]
      },
      { 
        id: 2, 
        name: 'Product Documentation Store', 
        detail: 'Technical documentation, API references, and product specifications',
        documents: [
          { id: 'd3', name: 'API_Reference.md', type: 'md', size: '890 KB' },
          { id: 'd4', name: 'Product_Specs.xlsx', type: 'xlsx', size: '3.2 MB' },
          { id: 'd5', name: 'User_Guide.pdf', type: 'pdf', size: '5.1 MB' },
        ]
      },
      { 
        id: 3, 
        name: 'Sales Knowledge Base', 
        detail: 'Sales scripts, product comparisons, and pricing information',
        documents: [
          { id: 'd6', name: 'Pricing_Sheet.xlsx', type: 'xlsx', size: '450 KB' },
        ]
      },
      { 
        id: 4, 
        name: 'Technical Support Store', 
        detail: 'Technical troubleshooting guides and system documentation',
        documents: [
          { id: 'd7', name: 'System_Architecture.pdf', type: 'pdf', size: '4.2 MB' },
          { id: 'd8', name: 'Troubleshooting.txt', type: 'txt', size: '120 KB' },
        ]
      },
      { 
        id: 5, 
        name: 'HR Policies Store', 
        detail: 'Employee handbook, policies, and procedures',
        documents: [
          { id: 'd9', name: 'Employee_Handbook.docx', type: 'docx', size: '1.5 MB' },
        ]
      }
    ];

    // Initialize sample agents
    this.dashboardData.agents.internal.subAgents = [
      { id: 'internal-default', name: 'Default Internal Agent', collections: [2, 4, 5], status: 'active', isDefault: true, prompt: 'You are the default internal assistant with access to all internal knowledge bases for general employee inquiries.' },
      { id: 1, name: 'HR Assistant', collections: [5], status: 'active', isDefault: false, prompt: 'You are an HR assistant focused on helping employees with HR-related questions, policies, and procedures.' },
      { id: 2, name: 'IT Support Bot', collections: [4], status: 'active', isDefault: false, prompt: 'You are an IT support specialist helping employees resolve technical issues and answer IT-related questions.' },
      { id: 3, name: 'Knowledge Manager', collections: [2, 4], status: 'active', isDefault: false, prompt: 'You are a knowledge management assistant helping employees find and organize company information.' }
    ];

    this.dashboardData.agents.customer.subAgents = [
      { id: 'customer-default', name: 'Default Customer Agent', collections: [1, 2, 3], status: 'active', isDefault: true, prompt: 'You are the default customer service agent with broad access to help customers with any type of inquiry.' },
      { id: 4, name: 'Sales Assistant', collections: [3, 1], status: 'active', isDefault: false, prompt: 'You are a sales assistant helping customers find the right products and answering sales-related questions.' },
      { id: 5, name: 'Support Bot', collections: [1, 2], status: 'active', isDefault: false, prompt: 'You are a customer support specialist helping resolve customer issues and providing technical assistance.' },
      { id: 6, name: 'Product Guide', collections: [2], status: 'active', isDefault: false, prompt: 'You are a product expert helping customers understand and use our products effectively.' }
    ];
  }

  onViewChange(view: ViewType): void {
    this.dashboardData.activeView = view;
  }

  onOpenCreateModal(agentType: string): void {
    this.editingStates.newAgent = { name: '', type: agentType, collections: [] };
    this.editingStates.selectedCollections = [];
    this.modalStates.showCreateModal = true;
  }

  onCreateAgent(): void {
    if (this.editingStates.newAgent.name && this.editingStates.newAgent.type && this.editingStates.selectedCollections.length > 0) {
      console.log('Creating agent:', { ...this.editingStates.newAgent, collections: this.editingStates.selectedCollections });
      this.onCloseModal('create');
    }
  }

  onToggleCollection(collectionId: number): void {
    const index = this.editingStates.selectedCollections.indexOf(collectionId);
    if (index > -1) {
      this.editingStates.selectedCollections.splice(index, 1);
    } else {
      this.editingStates.selectedCollections.push(collectionId);
    }
  }

  onDeleteAgent(agent: Agent): void {
    if (agent.isDefault) {
      alert("Default agents cannot be deleted.");
      return;
    }
    this.editingStates.agentToDelete = agent;
    this.modalStates.showDeleteModal = true;
  }

  onEditAgent(agent: Agent): void {
    this.editingStates.editingAgent = { ...agent };
    this.editingStates.selectedCollections = [...agent.collections];
    this.modalStates.showEditAgentModal = true;
  }

  onEditPrompt(data: { agent: Agent, isPrimary?: boolean }): void {
    this.dashboardData.selectedAgent = { ...data.agent, isPrimary: data.isPrimary || false } as any;
    this.editingStates.promptText = data.agent.prompt || '';
    this.modalStates.showPromptModal = true;
  }

  onCreateCollection(): void {
    if (this.editingStates.newCollection.name && this.editingStates.newCollection.detail) {
      const newCol: Collection = {
        id: Date.now(),
        name: this.editingStates.newCollection.name,
        detail: this.editingStates.newCollection.detail,
        documents: []
      };
      this.dashboardData.collections.push(newCol);
      this.onCloseModal('createCollection');
    }
  }

  onViewCollection(collection: Collection): void {
    this.dashboardData.selectedCollection = collection;
    this.modalStates.showCollectionDetailsModal = true;
  }

  onEditCollection(collection: Collection): void {
    this.editingStates.editingCollection = { ...collection };
    this.modalStates.showEditCollectionModal = true;
  }

  onDeleteCollection(collection: Collection): void {
    this.editingStates.collectionToDelete = collection;
    this.modalStates.showDeleteCollectionModal = true;
  }

  onFileUpload(data: { collectionId: number, files: FileList }): void {
    const allowedTypes = ['pdf', 'docx', 'xlsx', 'md', 'txt'];
    const newDocuments: Document[] = Array.from(data.files).filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      return allowedTypes.includes(extension);
    }).map(file => ({
      id: `d${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() || '',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));

    const collectionIndex = this.dashboardData.collections.findIndex(col => col.id === data.collectionId);
    if (collectionIndex > -1) {
      this.dashboardData.collections[collectionIndex].documents.push(...newDocuments);
    }
  }

  onDeleteDocument(data: { collectionId: number, documentId: string }): void {
    const collectionIndex = this.dashboardData.collections.findIndex(col => col.id === data.collectionId);
    if (collectionIndex > -1) {
      const collection = this.dashboardData.collections[collectionIndex];
      collection.documents = collection.documents.filter(doc => doc.id !== data.documentId);
    }
  }

  onSaveEditAgent(): void {
    console.log('Saving agent edits:', this.editingStates.editingAgent, 'New collections:', this.editingStates.selectedCollections);
    this.onCloseModal('editAgent');
  }

  onSaveEditCollection(): void {
    if (this.editingStates.editingCollection?.name && this.editingStates.editingCollection?.detail) {
      const collectionIndex = this.dashboardData.collections.findIndex(col => col.id === this.editingStates.editingCollection!.id);
      if (collectionIndex > -1) {
        this.dashboardData.collections[collectionIndex] = { ...this.editingStates.editingCollection };
      }
      this.onCloseModal('editCollection');
    }
  }

  onSavePrompt(): void {
    console.log('Saving prompt for:', this.dashboardData.selectedAgent, 'New prompt:', this.editingStates.promptText);
    this.onCloseModal('prompt');
  }

  onConfirmDelete(type: 'agent' | 'collection'): void {
    if (type === 'agent') {
      console.log('Deleting agent:', this.editingStates.agentToDelete);
      this.onCloseModal('delete');
    } else if (type === 'collection') {
      console.log('Deleting collection:', this.editingStates.collectionToDelete);
      if (this.editingStates.collectionToDelete) {
        this.dashboardData.collections = this.dashboardData.collections.filter(col => col.id !== this.editingStates.collectionToDelete!.id);
      }
      this.onCloseModal('deleteCollection');
    }
  }

  onCloseModal(modalType: string): void {
    switch (modalType) {
      case 'create':
        this.modalStates.showCreateModal = false;
        this.editingStates.newAgent = { name: '', type: '', collections: [] };
        this.editingStates.selectedCollections = [];
        break;
      case 'prompt':
        this.modalStates.showPromptModal = false;
        this.dashboardData.selectedAgent = null;
        this.editingStates.promptText = '';
        break;
      case 'delete':
        this.modalStates.showDeleteModal = false;
        this.editingStates.agentToDelete = null;
        break;
      case 'createCollection':
        this.modalStates.showCreateCollectionModal = false;
        this.editingStates.newCollection = { name: '', detail: '' };
        break;
      case 'collectionDetails':
        this.modalStates.showCollectionDetailsModal = false;
        this.dashboardData.selectedCollection = null;
        break;
      case 'editAgent':
        this.modalStates.showEditAgentModal = false;
        this.editingStates.editingAgent = null;
        this.editingStates.selectedCollections = [];
        break;
      case 'deleteCollection':
        this.modalStates.showDeleteCollectionModal = false;
        this.editingStates.collectionToDelete = null;
        break;
      case 'editCollection':
        this.modalStates.showEditCollectionModal = false;
        this.editingStates.editingCollection = null;
        break;
    }
  }

  onUpdateNewAgent(updates: Partial<NewAgent> | {field: keyof NewAgent, value: any}): void {
    if ('field' in updates) {
      this.editingStates.newAgent = { 
        ...this.editingStates.newAgent, 
        [updates.field]: updates.value 
      };
    } else {
      this.editingStates.newAgent = { ...this.editingStates.newAgent, ...updates };
    }
  }

  onUpdateNewCollection(updates: Partial<NewCollection>): void {
    this.editingStates.newCollection = { ...this.editingStates.newCollection, ...updates };
  }

  onUpdateEditingCollection(updates: Partial<Collection>): void {
    if (this.editingStates.editingCollection) {
      this.editingStates.editingCollection = { ...this.editingStates.editingCollection, ...updates };
    }
  }

  onUpdatePromptText(text: string): void {
    this.editingStates.promptText = text;
  }
}