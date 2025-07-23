export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface Collection {
  id: number;
  name: string;
  detail: string;
  documents: Document[];
}

export interface Agent {
  id: string | number;
  name: string;
  collections: number[];
  status: string;
  isDefault: boolean;
  prompt: string;
  isPrimary?: boolean;
}

export interface PrimaryAgent {
  name: string;
  id: string;
  prompt: string;
  subAgents: Agent[];
}

export interface AgentData {
  internal: PrimaryAgent;
  customer: PrimaryAgent;
}

export interface NewAgent {
  name: string;
  type: string;
  collections: number[];
}

export interface NewCollection {
  name: string;
  detail: string;
}

export interface DashboardData {
  activeView: string;
  collections: Collection[];
  agents: AgentData;
  selectedCollection: Collection | null;
  selectedAgent: Agent | null;
}

export interface ModalStates {
  showCreateModal: boolean;
  showPromptModal: boolean;
  showDeleteModal: boolean;
  showCreateCollectionModal: boolean;
  showCollectionDetailsModal: boolean;
  showEditAgentModal: boolean;
  showDeleteCollectionModal: boolean;
  showEditCollectionModal: boolean;
}

export interface EditingStates {
  editingCollection: Collection | null;
  collectionToDelete: Collection | null;
  agentToDelete: Agent | null;
  editingAgent: Agent | null;
  selectedCollections: number[];
  newAgent: NewAgent;
  newCollection: NewCollection;
  promptText: string;
}

export type ViewType = 'dashboard' | 'collections';