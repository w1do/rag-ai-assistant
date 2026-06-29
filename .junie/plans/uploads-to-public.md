---
sessionId: session-260629-230346-rodn
---

# Requirements

### Overview & Goals
Change file upload storage from `storage/app/private` (local disk) to `public/uploads` so that uploaded files are directly accessible via HTTP without symlinks or signed URLs.

### Scope
**In Scope:**
- Documents uploaded via `UploadKnowledgeHandler` (currently stored on `local` disk under `documents/`)
- Audio files uploaded via `UploadAudioHandler` (currently stored on `local` disk under `audio/`)
- File deletion in `DeleteKnowledgeAction` and `DeleteAssistantHandler`
- File reading in `ProcessKnowledgeAction` and `TranscribeAudioAction`
- Adding a new `uploads` disk in `config/filesystems.php`

**Out of Scope:**
- Avatar and background image uploads (already use `public` disk — `assistants/avatars`, `assistants/backgrounds`)
- Existing stored files migration

# Technical Design

### Current Implementation
- `UploadKnowledgeHandler`: `$command->dto->file->store('documents', 'local')` → `storage/app/private/documents/`
- `UploadAudioHandler`: `$command->file->store('audio')` → `storage/app/private/audio/` (default `local` disk)
- `ProcessKnowledgeAction`: reads via `Storage::disk('local')->path($knowledge->path)`
- `TranscribeAudioAction`: reads via `storage_path('app/private/'.$knowledge->path)`
- `DeleteKnowledgeAction`: deletes via `Storage::delete($knowledge->path)` (default `local` disk)
- `DeleteAssistantHandler`: deletes via `Storage::delete($knowledge->path)` (default `local` disk)

### Key Decisions
- Add a new `uploads` disk in `config/filesystems.php` pointing to `public_path('uploads')` with `public` visibility, so files are served directly at `/uploads/...`
- All upload/read/delete operations switch to this `uploads` disk
- `TranscribeAudioAction` switches from `storage_path()` hardcoded path to `Storage::disk('uploads')->path()`

### Proposed Changes

#### `config/filesystems.php`
Add new disk:
```php
'uploads' => [
    'driver' => 'local',
    'root' => public_path('uploads'),
    'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/uploads',
    'visibility' => 'public',
    'throw' => false,
    'report' => false,
],
```

#### `UploadKnowledgeHandler`
```php
$path = $command->dto->file->store('documents', 'uploads');
```

#### `UploadAudioHandler`
```php
$path = $command->file->store('audio', 'uploads');
```

#### `ProcessKnowledgeAction`
```php
$filePath = Storage::disk('uploads')->path($knowledge->path);
if (!Storage::disk('uploads')->exists($knowledge->path)) { ... }
$fileSize = Storage::disk('uploads')->size($knowledge->path);
```

#### `TranscribeAudioAction`
```php
$filePath = Storage::disk('uploads')->path($knowledge->path);
```

#### `DeleteKnowledgeAction`
```php
Storage::disk('uploads')->delete($knowledge->path);
```

#### `DeleteAssistantHandler`
```php
Storage::disk('uploads')->delete($knowledge->path);
```

### File Structure
- `config/filesystems.php` — add `uploads` disk
- `app/Domain/Knowledge/Handlers/UploadKnowledgeHandler.php` — change disk
- `app/Domain/Assistant/Handlers/UploadAudioHandler.php` — change disk
- `app/Domain/Knowledge/Actions/ProcessKnowledgeAction.php` — change disk references
- `app/Domain/Assistant/Actions/TranscribeAudioAction.php` — change path resolution
- `app/Domain/Knowledge/Actions/DeleteKnowledgeAction.php` — change disk
- `app/Domain/Assistant/Handlers/DeleteAssistantHandler.php` — change disk

# Testing

### Validation Approach
Update existing tests to use `Storage::fake('uploads')` instead of `Storage::fake('local')`.

### Key Scenarios
- Upload a document → file appears in `public/uploads/documents/`
- Upload audio → file appears in `public/uploads/audio/`
- Delete knowledge → file removed from `uploads` disk
- Process knowledge → file read correctly from `uploads` disk
- Transcribe audio → file path resolved correctly from `uploads` disk

### Test Changes
- `tests/Feature/Domain/Knowledge/Actions/ProcessKnowledgeActionTest.php` — switch `Storage::fake('local')` to `Storage::fake('uploads')`
- `tests/Feature/Assistant/TranscribeAudioActionTest.php` — switch disk reference
- `tests/Feature/KnowledgeTest.php` — switch disk reference
- `tests/Feature/AssistantTest.php` — switch disk reference if applicable

# Delivery Steps

### ✓ Step 1: Add `uploads` disk to filesystems config
A new `uploads` filesystem disk is configured pointing to `public/uploads`.

- Add `uploads` disk entry in `config/filesystems.php` with `driver=local`, `root=public_path('uploads')`, `url` pointing to `/uploads`, and `visibility=public`
- Ensure `public/uploads` directory is git-tracked (add `.gitkeep`)

### ✓ Step 2: Switch document and audio upload handlers to `uploads` disk
All file uploads now go to `public/uploads` instead of `storage/app/private`.

- Update `UploadKnowledgeHandler`: change `store('documents', 'local')` → `store('documents', 'uploads')`
- Update `UploadAudioHandler`: change `store('audio')` → `store('audio', 'uploads')`

### ✓ Step 3: Switch file reading actions to `uploads` disk
File processing and transcription read files from the new `uploads` disk.

- Update `ProcessKnowledgeAction`: replace all `Storage::disk('local')` calls with `Storage::disk('uploads')`
- Update `TranscribeAudioAction`: replace `storage_path('app/private/'.$knowledge->path)` with `Storage::disk('uploads')->path($knowledge->path)`

### ✓ Step 4: Switch file deletion to `uploads` disk and update tests
File deletion and all related tests use the `uploads` disk.

- Update `DeleteKnowledgeAction`: change `Storage::delete()` → `Storage::disk('uploads')->delete()`
- Update `DeleteAssistantHandler`: change `Storage::delete()` → `Storage::disk('uploads')->delete()`
- Update affected tests (`ProcessKnowledgeActionTest`, `TranscribeAudioActionTest`, `KnowledgeTest`, `AssistantTest`) to use `Storage::fake('uploads')`
- Run tests to confirm all pass