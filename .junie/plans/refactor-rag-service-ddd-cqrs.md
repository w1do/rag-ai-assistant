# Requirements

### Overview & Goals
Refactor `RAGService` into DDD and CQRS layers to improve maintainability, separation of concerns, and clean architecture.

### Scope
- **In Scope**:
  - Moving infrastructure logic (clients initialization) to an infrastructure layer.
  - Creating specific Actions (Commands) for state-changing operations.
  - Creating specific Queries for data-retrieval operations.
  - Decoupling document processing logic.
- **Out of Scope**:
  - Changing the underlying AI models or vector store technology.

# Technical Design

### Proposed Changes

#### 1. Infrastructure Layer (`app/Infrastructure/AI`)
- **AIClientFactory**: Service to instantiate `PolzaAIEmbeddingGenerator` and `OpenAIChat` with proper configuration from `.env`.
- **VectorStoreManager**: Service to manage `QdrantVectorStore` instances, including collection creation and lifecycle.

#### 2. Domain Layer (`app/Domain/Shared/AI`)
- **DocumentProcessor**: Domain service for text normalization and document splitting.

#### 3. Application Layer (CQRS)
- **Commands (Actions)**:
  - `app/Domain/Assistant/Actions/IndexAssistantDocumentsAction`: Handles the end-to-end indexing process.
  - `app/Domain/Assistant/Actions/DeleteAssistantDataAction`: Handles cleanup of assistant data in Qdrant and DB.
- **Queries**:
  - `app/Domain/Chat/Queries/AskAssistantQuery`: Encapsulates the Question Answering logic.
  - `app/Domain/Chat/Queries/SearchContextQuery`: Encapsulates semantic search logic.

### File Changes
- `app/Infrastructure/AI/AIClientFactory.php` (New)
- `app/Infrastructure/AI/VectorStoreManager.php` (New)
- `app/Domain/Shared/AI/Services/DocumentProcessor.php` (New)
- `app/Domain/Assistant/Actions/IndexAssistantDocumentsAction.php` (New)
- `app/Domain/Assistant/Actions/DeleteAssistantDataAction.php` (New)
- `app/Domain/Chat/Queries/AskAssistantQuery.php` (New)
- `app/Domain/Chat/Queries/SearchContextQuery.php` (New)
- `app/Domain/Shared/AI/Services/RAGService.php` (Delete)

# Delivery Steps

### ✓ Step 1: Create Infrastructure Layer components
Create factories for AI clients and Vector Store management to decouple technical configuration from business logic.

### ✓ Step 2: Create Domain Document Processor
Extract text normalization and document splitting logic into a dedicated domain service.

### ✓ Step 3: Implement CQRS Queries
Create `AskAssistantQuery` and `SearchContextQuery` to handle retrieval operations.

### ✓ Step 4: Implement CQRS Commands (Actions)
Create `IndexAssistantDocumentsAction` and `DeleteAssistantDataAction` to handle state-changing operations.

### ✓ Step 5: Refactor existing callers and remove RAGService
Update `ProcessDocumentAction`, `AskAssistantAction` and any other references to use the new architecture, then delete the old `RAGService`.
