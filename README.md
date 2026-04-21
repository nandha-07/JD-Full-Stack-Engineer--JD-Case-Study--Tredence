# HR Workflow Designer

A visual drag-and-drop workflow designer for HR processes built as a case study for **Tredence Studio's Full Stack Engineering Internship**.

## 🚀 Live Demo

Run locally with `npm run dev` → http://localhost:5173

---

## 🏗️ Architecture

```
src/
├── api/
│   ├── mockApi.ts          # Mock API layer (GET /automations, POST /simulate)
│   └── templates.ts        # Pre-built workflow templates
├── components/
│   ├── forms/
│   │   ├── KeyValueEditor.tsx   # Reusable key-value pair editor
│   │   └── NodeFormPanel.tsx    # Dynamic node configuration forms
│   ├── nodes/
│   │   ├── StartNode.tsx        # Start node custom component
│   │   ├── TaskNode.tsx         # Task node custom component
│   │   ├── ApprovalNode.tsx     # Approval node custom component
│   │   ├── AutomatedNode.tsx    # Automated step node custom component
│   │   └── EndNode.tsx          # End node custom component
│   ├── panels/
│   │   └── SandboxPanel.tsx     # Workflow test/simulation panel
│   ├── sidebar/
│   │   ├── NodePalette.tsx      # Draggable node library
│   │   └── TemplatesPanel.tsx   # Pre-built workflow templates
│   └── ui/
│       ├── Toolbar.tsx          # Top toolbar (export/import/undo/redo)
│       └── WorkflowCanvas.tsx   # React Flow canvas with drag-and-drop
├── hooks/                   # (extensible for custom hooks)
├── store/
│   └── workflowStore.ts     # Zustand store with temporal (undo/redo)
├── types/
│   └── workflow.ts          # TypeScript type definitions
└── utils/
    └── workflowUtils.ts     # Validation, serialization, export/import
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Canvas | **@xyflow/react** (React Flow v12) |
| Styling | Tailwind CSS v4 |
| State | **Zustand** with **zundo** temporal (undo/redo) |
| Icons | Lucide React |
| Mock API | In-memory async handlers (no MSW needed) |

---

## ▶️ How to Run

```bash
cd hr-workflow-designer
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## ✅ Implemented Features

### Core Requirements

| Requirement | Status |
|---|---|
| Drag-and-drop canvas (React Flow) | ✅ |
| 5 custom node types (Start, Task, Approval, Automated, End) | ✅ |
| Node configuration sidebar panel per type | ✅ |
| Start Node: title + metadata key-value pairs | ✅ |
| Task Node: title, description, assignee, due date, custom fields | ✅ |
| Approval Node: title, approver role, auto-approve threshold | ✅ |
| Automated Step Node: action picker from mock API + dynamic params | ✅ |
| End Node: end message + summary flag toggle | ✅ |
| Mock API — `GET /automations` (8 automated actions) | ✅ |
| Mock API — `POST /simulate` (BFS graph traversal execution) | ✅ |
| Workflow Sandbox panel with step-by-step log | ✅ |
| Auto-validation with error/warning badges | ✅ |

### Bonus Features

| Feature | Status |
|---|---|
| Export workflow as JSON | ✅ |
| Import workflow from JSON | ✅ |
| Undo / Redo (Ctrl+Z / Ctrl+Y) | ✅ |
| Mini-map | ✅ |
| Validation errors shown visually on nodes | ✅ |
| Node templates (Onboarding, Leave Approval, Doc Verification) | ✅ |
| Editable workflow name | ✅ |
| Cycle detection in validation | ✅ |

---

## 🎨 Design Decisions

### State Architecture
- **Zustand** was chosen over Redux for its lightweight, hook-first API
- **zundo temporal middleware** provides undo/redo without manual history stacks
- Canvas state, UI state, and simulation state are all co-located in one store with selective persistence for undo history (UI state is excluded from undo)

### Mock API
- Uses **in-memory async functions** instead of MSW/JSON Server — simpler setup, no service worker registration, same API contract
- `GET /automations` returns 8 real-world automation actions (email, Slack, Jira, etc.)
- `POST /simulate` performs BFS traversal, validates structure (cycles, orphan nodes, missing connections), and returns step-by-step results

### Type System
- All node data types are strongly typed with discriminated unions (`type: 'start' | 'task' | ...`)
- React Flow uses `Record<string, any>` as the generic data type to satisfy its internal constraints, with proper casting at the component level

### Component Architecture
- Each node type has its own visual component displaying its most relevant data
- The `NodeFormPanel` dynamically renders the correct form based on `data.type` — one panel component handles all 5 node types
- `KeyValueEditor` is a reusable controlled component for metadata/custom fields

### Validation
- Real-time validation runs whenever nodes/edges change
- Errors are synced back into node data (`hasError`, `errorMessage`) so they appear visually on the canvas node
- Cycle detection uses DFS to detect back edges

---

## 🔮 What I Would Add With More Time

- Node version history (diff tracking per node)
- Auto-layout (Dagre/ELK algorithm)
- Collaborative editing (Yjs / LiveBlocks)
- Real backend persistence (PostgreSQL + FastAPI)
- Keyboard navigation and accessibility (ARIA)
- Node grouping / compound nodes
- Workflow versioning with timeline view
- Export as BPMN 2.0 XML

---

## 📋 Assumptions

1. "Mock API" was interpreted as in-memory async functions (equivalent behavior to MSW but simpler)
2. Multiple End nodes are allowed (parallel branch completion)
3. Auto-approve threshold of 0 means "manual approval only"
4. The simulation BFS traversal processes nodes in topological order

---

*Built by Nandha Kumar K for Tredence Studio Full Stack Engineering Internship 2025*
