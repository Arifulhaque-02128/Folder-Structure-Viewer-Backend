# API Routes

Base URL: `https://folder-structure-viewer-backend-j3md.onrender.com/`

## Endpoints

### 1. Check Server
```
GET /check
```
Check if the server is running.

---

### 2. Get All Folders
```
GET /api/folders
```
Retrieve all folders in tree structure.

---

### 3. Create Root Folder
```
POST /api/folders
```

**Body:**
```json
{
  "name": "Projects",
  "parentId": null
}
```

---

### 4. Create Subfolder
```
POST /api/folders
```

**Body:**
```json
{
  "name": "Work Files",
  "parentId": "789ghi"
}
```

---

### 5. Delete Folder
```
DELETE /api/folders/:id
```

**Example:**
```
DELETE /api/folders/101jkl
```

---