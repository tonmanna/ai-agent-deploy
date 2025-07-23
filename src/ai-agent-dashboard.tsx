  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      docx: '📝',
      xlsx: '📊',
      md: '📋',
      txt: '📃'
    };
    return icons[type] || '📎';
  };  const handleSavePrompt = () => {
    console.log('Saving prompt for:', selectedAgent, 'New prompt:', promptText);
    // Here you would save the prompt to your backend
    setShowPromptModal(false);
    setSelectedAgent(null);
    setPromptText('');
  };import React, { useState } from 'react';
import { ChevronRight, Plus, Settings, Database, GitBranch, X, Check, User, Users, Edit2, Trash2, Shield, Upload, FileText, File } from 'lucide-react';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [showCollectionDetailsModal, setShowCollectionDetailsModal] = useState(false);
  const [showEditAgentModal, setShowEditAgentModal] = useState(false);
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] = useState(false);
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: '', type: '', collections: [] });
  const [newCollection, setNewCollection] = useState({ name: '', detail: '' });
  const [promptText, setPromptText] = useState('');

  // Sample data
  const [collections, setCollections] = useState([
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
    },
  ]);

  const agents = {
    internal: {
      name: 'Internal Agent',
      id: 'internal-primary',
      prompt: 'You are an internal assistant helping employees with company-related tasks, policies, and procedures.',
      subAgents: [
        { id: 'internal-default', name: 'Default Internal Agent', collections: [2, 4, 5], status: 'active', isDefault: true, prompt: 'You are the default internal assistant with access to all internal knowledge bases for general employee inquiries.' },
        { id: 1, name: 'HR Assistant', collections: [5], status: 'active', isDefault: false, prompt: 'You are an HR assistant focused on helping employees with HR-related questions, policies, and procedures.' },
        { id: 2, name: 'IT Support Bot', collections: [4], status: 'active', isDefault: false, prompt: 'You are an IT support specialist helping employees resolve technical issues and answer IT-related questions.' },
        { id: 3, name: 'Knowledge Manager', collections: [2, 4], status: 'active', isDefault: false, prompt: 'You are a knowledge management assistant helping employees find and organize company information.' },
      ]
    },
    customer: {
      name: 'Customer Agent',
      id: 'customer-primary',
      prompt: 'You are a customer service assistant focused on helping customers with their inquiries and providing excellent support.',
      subAgents: [
        { id: 'customer-default', name: 'Default Customer Agent', collections: [1, 2, 3], status: 'active', isDefault: true, prompt: 'You are the default customer service agent with broad access to help customers with any type of inquiry.' },
        { id: 4, name: 'Sales Assistant', collections: [3, 1], status: 'active', isDefault: false, prompt: 'You are a sales assistant helping customers find the right products and answering sales-related questions.' },
        { id: 5, name: 'Support Bot', collections: [1, 2], status: 'active', isDefault: false, prompt: 'You are a customer support specialist helping resolve customer issues and providing technical assistance.' },
        { id: 6, name: 'Product Guide', collections: [2], status: 'active', isDefault: false, prompt: 'You are a product expert helping customers understand and use our products effectively.' },
      ]
    }
  };

  const handleOpenCreateModal = (agentType) => {
    setNewAgent({ name: '', type: agentType, collections: [] });
    setSelectedCollections([]);
    setShowCreateModal(true);
  };

  const handleCreateAgent = () => {
    if (newAgent.name && newAgent.type && selectedCollections.length > 0) {
      // Handle agent creation
      console.log('Creating agent:', { ...newAgent, collections: selectedCollections });
      setShowCreateModal(false);
      setNewAgent({ name: '', type: '', collections: [] });
      setSelectedCollections([]);
    }
  };

  const toggleCollection = (collectionId) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleDeleteAgent = (agent) => {
    if (agent.isDefault) {
      alert("Default agents cannot be deleted.");
      return;
    }
    setAgentToDelete(agent);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting agent:', agentToDelete);
    // Here you would delete the agent from your backend
    setShowDeleteModal(false);
    setAgentToDelete(null);
  };

  const handleEditAgent = (agent) => {
    // Sub-agents can edit collections
    setEditingAgent({ ...agent });
    setSelectedCollections([...agent.collections]);
    setShowEditAgentModal(true);
  };

  const handleSaveEditAgent = () => {
    console.log('Saving agent edits:', editingAgent, 'New collections:', selectedCollections);
    // Here you would save the agent updates to your backend
    setShowEditAgentModal(false);
    setEditingAgent(null);
    setSelectedCollections([]);
  };

  const handleEditPrompt = (agent, isPrimary = false) => {
    setSelectedAgent({ ...agent, isPrimary });
    setPromptText(agent.prompt || '');
    setShowPromptModal(true);
  };

  const handleCreateCollection = () => {
    if (newCollection.name && newCollection.detail) {
      const newCol = {
        id: Date.now(),
        name: newCollection.name,
        detail: newCollection.detail,
        documents: []
      };
      setCollections([...collections, newCol]);
      setShowCreateCollectionModal(false);
      setNewCollection({ name: '', detail: '' });
    }
  };

  const handleViewCollection = (collection) => {
    setSelectedCollection(collection);
    setShowCollectionDetailsModal(true);
  };

  const handleDeleteDocument = (collectionId, documentId) => {
    setCollections(prevCollections => 
      prevCollections.map(col => 
        col.id === collectionId 
          ? { ...col, documents: col.documents.filter(doc => doc.id !== documentId) }
          : col
      )
    );
  };

  const handleFileUpload = (collectionId, files) => {
    const allowedTypes = ['pdf', 'docx', 'xlsx', 'md', 'txt'];
    const newDocuments = Array.from(files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(extension);
    }).map(file => ({
      id: `d${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split('.').pop().toLowerCase(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));

    setCollections(prevCollections => 
      prevCollections.map(col => 
        col.id === collectionId 
          ? { ...col, documents: [...col.documents, ...newDocuments] }
          : col
      )
    );
  };

  const handleEditCollection = (collection, e) => {
    e.stopPropagation(); // Prevent opening the details modal
    setEditingCollection({ ...collection });
    setShowEditCollectionModal(true);
  };

  const handleSaveEditCollection = () => {
    if (editingCollection.name && editingCollection.detail) {
      setCollections(prevCollections => 
        prevCollections.map(col => 
          col.id === editingCollection.id ? editingCollection : col
        )
      );
      setShowEditCollectionModal(false);
      setEditingCollection(null);
    }
  };

  const handleDeleteCollection = (collection, e) => {
    e.stopPropagation(); // Prevent opening the details modal
    setCollectionToDelete(collection);
    setShowDeleteCollectionModal(true);
  };

  const confirmDeleteCollection = () => {
    console.log('Deleting collection:', collectionToDelete);
    setCollections(prevCollections => 
      prevCollections.filter(col => col.id !== collectionToDelete.id)
    );
    // Here you would also need to remove this collection from any agents that have it
    setShowDeleteCollectionModal(false);
    setCollectionToDelete(null);
  };

  const AgentNode = ({ agent, collections }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
      {agent.isDefault && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full" title="Default Agent">
          <Shield className="w-3 h-3" />
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{agent.name}</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditPrompt(agent)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Prompt"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditAgent(agent)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit Agent"
          >
            <Settings className="w-4 h-4" />
          </button>
          {!agent.isDefault && (
            <button
              onClick={() => handleDeleteAgent(agent)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Agent"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
            {agent.status}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <p className="mb-1">Collections: {agent.collections.length}</p>
                            <div className="flex flex-wrap gap-1">
          {agent.collections.map(colId => {
            const col = collections.find(c => c.id === colId);
            return col ? (
              <span key={colId} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                {col.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Agent Admin</h1>
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeView === 'dashboard' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              AI Agents
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => setActiveView('collections')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeView === 'collections' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              Collections
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeView === 'dashboard' && 'Agent Organization Chart'}
              {activeView === 'collections' && 'Collection Management'}
            </h2>
            {activeView === 'collections' && (
              <button
                onClick={() => setShowCreateCollectionModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collection
              </button>
            )}
          </div>
        </div>

        {/* Dashboard View - Organization Chart */}
        {activeView === 'dashboard' && (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Primary Agents */}
              <div className="grid grid-cols-2 gap-8">
                {/* Internal Agent */}
                <div>
                  <div className="bg-blue-600 text-white rounded-lg p-6 mb-6 relative group">
                    <button
                      onClick={() => handleEditPrompt(agents.internal, true)}
                      className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit Prompt"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center">
                      <User className="w-8 h-8 mr-3" />
                      <div>
                        <h3 className="text-xl font-semibold">{agents.internal.name}</h3>
                        <p className="text-blue-100">Primary Agent (Router)</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Line */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300 -top-6"></div>
                  </div>
                  
                  {/* Sub-agents */}
                  <div className="space-y-3">
                    {agents.internal.subAgents.map(agent => (
                      <AgentNode key={agent.id} agent={agent} collections={collections} />
                    ))}
                    
                    {/* Add Sub-Agent Button */}
                    <button
                      onClick={() => handleOpenCreateModal('internal')}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center text-gray-600 hover:text-blue-600"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Sub-Agent
                    </button>
                  </div>
                </div>

                {/* Customer Agent */}
                <div>
                  <div className="bg-green-600 text-white rounded-lg p-6 mb-6 relative group">
                    <button
                      onClick={() => handleEditPrompt(agents.customer, true)}
                      className="absolute top-4 right-4 text-green-200 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit Prompt"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center">
                      <Users className="w-8 h-8 mr-3" />
                      <div>
                        <h3 className="text-xl font-semibold">{agents.customer.name}</h3>
                        <p className="text-green-100">Primary Agent (Router)</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Line */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300 -top-6"></div>
                  </div>
                  
                  {/* Sub-agents */}
                  <div className="space-y-3">
                    {agents.customer.subAgents.map(agent => (
                      <AgentNode key={agent.id} agent={agent} collections={collections} />
                    ))}
                    
                    {/* Add Sub-Agent Button */}
                    <button
                      onClick={() => handleOpenCreateModal('customer')}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 transition-colors flex items-center justify-center text-gray-600 hover:text-green-600"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Sub-Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collections View */}
        {activeView === 'collections' && (
          <div className="p-8">
            <div className="grid gap-4 max-w-4xl">
              {collections.map(collection => (
                <div key={collection.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative group"
                     onClick={() => handleViewCollection(collection)}>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCollection(collection);
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Upload Documents"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleEditCollection(collection, e)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Collection"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCollection(collection, e)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-6 h-6 text-gray-400 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{collection.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{collection.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">{collection.documents.length} document(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Sub-Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Sub-Agent
                {newAgent.type && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    for {newAgent.type === 'internal' ? 'Internal Agent' : 'Customer Agent'}
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewAgent({ name: '', type: '', collections: [] });
                  setSelectedCollections([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Agent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Agent Name
                </label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., HR Assistant"
                />
              </div>

              {/* Collection Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Collections
                </label>
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {collections.map(collection => (
                    <label
                      key={collection.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() => toggleCollection(collection.id)}
                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{collection.name}</p>
                        <p className="text-xs text-gray-600">{collection.documents.toLocaleString()} documents</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewAgent({ name: '', type: '', collections: [] });
                  setSelectedCollections([]);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                disabled={!newAgent.name || selectedCollections.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {showEditCollectionModal && editingCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Collection</h3>
              <button
                onClick={() => {
                  setShowEditCollectionModal(false);
                  setEditingCollection(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Marketing Materials"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Details
                </label>
                <textarea
                  value={editingCollection.detail}
                  onChange={(e) => setEditingCollection({ ...editingCollection, detail: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Describe the purpose and contents of this collection..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Documents:</strong> {editingCollection.documents.length} file(s)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Documents in this collection will not be affected by name or detail changes.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditCollectionModal(false);
                  setEditingCollection(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditCollection}
                disabled={!editingCollection.name || !editingCollection.detail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collection Modal */}
      {showDeleteCollectionModal && collectionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Delete Collection</h3>
              <button
                onClick={() => {
                  setShowDeleteCollectionModal(false);
                  setCollectionToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>{collectionToDelete.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This collection contains {collectionToDelete.documents.length} document(s).
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All documents in this collection will be permanently deleted. 
                Any agents using this collection will need to be updated.
              </p>
            </div>

            {/* Check if collection is being used by agents */}
            {(() => {
              const agentsUsingCollection = [
                ...agents.internal.subAgents.filter(agent => agent.collections.includes(collectionToDelete.id)),
                ...agents.customer.subAgents.filter(agent => agent.collections.includes(collectionToDelete.id))
              ];
              
              if (agentsUsingCollection.length > 0) {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      This collection is currently used by:
                    </p>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {agentsUsingCollection.map(agent => (
                        <li key={agent.id}>{agent.name}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteCollectionModal(false);
                  setCollectionToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCollection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal (for sub-agents) */}
      {showEditAgentModal && editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Sub-Agent - {editingAgent.name}
              </h3>
              <button
                onClick={() => {
                  setShowEditAgentModal(false);
                  setEditingAgent(null);
                  setSelectedCollections([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Agent Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {editingAgent.isDefault && (
                    <Shield className="w-4 h-4 text-blue-500" />
                  )}
                  <h4 className="font-medium text-gray-900">{editingAgent.name}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Status: <span className="text-green-600 font-medium">{editingAgent.status}</span>
                </p>
              </div>

              {/* Collection Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Collections for this Sub-Agent
                </label>
                <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                  {collections.map(collection => (
                    <label
                      key={collection.id}
                      className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() => toggleCollection(collection.id)}
                        className="mr-3 mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{collection.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{collection.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">{collection.documents.length} document(s)</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {selectedCollections.length} collection(s)
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditAgentModal(false);
                    setEditingAgent(null);
                    setSelectedCollections([]);
                    handleEditPrompt(editingAgent);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Prompt
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditAgentModal(false);
                  setEditingAgent(null);
                  setSelectedCollections([]);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditAgent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Prompt Modal */}
      {showPromptModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Prompt - {selectedAgent.name}
              </h3>
              <button
                onClick={() => {
                  setShowPromptModal(false);
                  setSelectedAgent(null);
                  setPromptText('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedAgent.isPrimary ? 'Primary Agent' : 'Sub-Agent'} Prompt
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Enter the prompt instructions for this agent..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  This prompt will guide the agent's behavior and responses when handling queries.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPromptModal(false);
                  setSelectedAgent(null);
                  setPromptText('');
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && agentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Delete Sub-Agent</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAgentToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>{agentToDelete.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. The agent and all its configurations will be permanently removed.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This sub-agent has {agentToDelete.collections.length} collection(s) attached. 
                These collections will remain available for other agents.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAgentToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Collection</h3>
              <button
                onClick={() => {
                  setShowCreateCollectionModal(false);
                  setNewCollection({ name: '', detail: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Marketing Materials"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Details
                </label>
                <textarea
                  value={newCollection.detail}
                  onChange={(e) => setNewCollection({ ...newCollection, detail: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Describe the purpose and contents of this collection..."
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Supported formats:</strong> PDF, DOCX, XLSX, MD, TXT
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateCollectionModal(false);
                  setNewCollection({ name: '', detail: '' });
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!newCollection.name || !newCollection.detail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collection Details Modal */}
      {showCollectionDetailsModal && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCollection.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedCollection.detail}</p>
              </div>
              <button
                onClick={() => {
                  setShowCollectionDetailsModal(false);
                  setSelectedCollection(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <label className="w-full flex items-center justify-center px-4 py-6 bg-gray-50 text-gray-600 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors">
                <Upload className="w-6 h-6 mr-2" />
                <span className="text-sm">Click to upload documents (PDF, DOCX, XLSX, MD, TXT)</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.xlsx,.md,.txt"
                  onChange={(e) => handleFileUpload(selectedCollection.id, e.target.files)}
                />
              </label>
            </div>

            {/* Documents List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Documents ({selectedCollection.documents.length})</h4>
              {selectedCollection.documents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
              ) : (
                <div className="grid gap-3">
                  {selectedCollection.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getFileIcon(doc.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.type.toUpperCase()} • {doc.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${doc.name}?`)) {
                            handleDeleteDocument(selectedCollection.id, doc.id);
                            // Update the modal's selected collection to reflect changes
                            setSelectedCollection({
                              ...selectedCollection,
                              documents: selectedCollection.documents.filter(d => d.id !== doc.id)
                            });
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowCollectionDetailsModal(false);
                  setSelectedCollection(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;