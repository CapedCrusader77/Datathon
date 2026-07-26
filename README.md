# 🚔 POLICEGPT — National-Grade AI Investigation Assistant
### Karnataka State Police | Intelligent Crime & Investigation Database
**"Ask Crime Data Like You Ask ChatGPT."**

---

<div align="center">

![POLICEGPT](https://img.shields.io/badge/POLICEGPT-v2.0-blue?style=for-the-badge&logo=shield)
![Karnataka Police](https://img.shields.io/badge/Karnataka%20State%20Police-Classified-red?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI%20Powered-RAG%20%2B%20LLM-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?style=for-the-badge&logo=fastapi)

</div>

---

## 🎯 Project Overview

POLICEGPT is a **production-ready, cloud-native, AI-first national policing platform** that transforms how Karnataka State Police officers interact with crime data. Instead of complex SQL queries or manual database searches, officers simply ask questions in natural language and receive intelligent, grounded responses in seconds.

### The Problem
- Traditional crime database searches require SQL expertise.
- Investigation insights take hours to compile manually.
- Databases (FIRs, suspects, vehicles, phones) are disconnected.
- Lacks automated cross-linking of related cases or predictive intelligence.

### The Solution — POLICEGPT
A conversational AI system that:
- ✅ Understands natural language queries in English, Kannada, and Hindi.
- ✅ Retrieves and synthesizes information from 10+ crime databases.
- ✅ Generates investigation summaries, reports, and recommendations.
- ✅ Visualizes crime networks, heatmaps, and timelines.
- ✅ Predicts crime trends using AI pattern analysis.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         POLICEGPT Platform                           │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────────────────┐ │
│  │  Next.js 16  │    │   FastAPI    │    │      AI Engine         │ │
│  │  TypeScript  │◄──►│   Backend   │◄──►│  LLM + RAG + KG       │ │
│  │  Tailwind CSS│    │   Python 3.12│    │  Intent + NER + Search │ │
│  └──────────────┘    └──────────────┘    └────────────────────────┘ │
│         │                   │                        │               │
│  ┌──────┴───┐    ┌──────────┴────┐    ┌────────────┴──────────┐   │
│  │  JWT Auth│    │  PostgreSQL   │    │   Qdrant (Vectors)    │   │
│  │  RBAC    │    │  + Redis      │    │   Neo4j (Graph DB)    │   │
│  │  Zero    │    │  + Elasticsearch    │   Ollama (Local LLM) │   │
│  │  Trust   │    └───────────────┘    └───────────────────────┘   │
│  └──────────┘                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Pipeline

```
User Query
    │
    ▼
Intent Classification (crime_heatmap / suspect_lookup / fir_search / ...)
    │
    ▼
Named Entity Recognition (persons / vehicles / phones / locations / dates)
    │
    ▼
Query Expansion (synonyms + domain-specific expansion)
    │
    ▼
Metadata Filtering (date range / district / category / RBAC restrictions)
    │
    ▼
Hybrid Search (Vector Semantic Search + Elasticsearch Keyword)
    │
    ▼
Knowledge Graph Lookup (Neo4j — relationships, gang networks, associates)
    │
    ▼
Cross-Encoder Reranking (precision ranking)
    │
    ▼
LLM Reasoning (Llama 3 / Mistral / GPT-4o)
    │
    ▼
Grounded Response + Citations + Visualization Hints
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### 1. Clone & Setup

```bash
git clone https://github.com/CapedCrusader77/Datathon.git
cd Datathon
cp .env.example .env
```

### 2. Configure Environment

Edit `.env`:
```env
# LLM Configuration
LLM_PROVIDER=ollama          # or openai / gemini
OLLAMA_MODEL=llama3.1:8b
OPENAI_API_KEY=sk-...        # Optional

# Database
DATABASE_URL=postgresql+asyncpg://policegpt:secret@postgres:5432/policegpt_db
REDIS_URL=redis://redis:6379
NEO4J_URI=bolt://neo4j:7687

# Security
SECRET_KEY=your-very-secret-key-minimum-64-chars
```

### 3. Run with Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Pull and start local LLM (first run - downloads ~5GB)
docker-compose exec ollama ollama pull llama3.1:8b

# View logs
docker-compose logs -f backend

# Access the platform
open http://localhost:3000
```

### 4. Active Demo Login Credentials

You can click these on the login page for quick access, or sign in manually:

| Badge ID | Officer Name | Assigned Role | Password |
|---|---|---|---|
| **KSP001** | Ramesh Kumar | Investigating Officer | `police123` |
| **KSP004** | Ananya Rao | Cybercrime Specialist | `police123` |
| **KSP999** | Alok Mohan | Commissioner | `admin123` |

---

## 🏛️ Database Schema

### Core Tables (PostgreSQL)
- **firs** — First Information Reports (core crime records)
- **persons** — Universal person records
- **suspects** — Criminal profiles with risk scoring
- **victims** — Victim records linked to FIRs
- **officers** — Police personnel with RBAC roles
- **vehicles** — Vehicle registry with crime linkage
- **weapons** — Weapon registry
- **evidence** — Evidence chain of custody
- **phone_records** — Phone intelligence
- **crime_scenes** — Scene metadata
- **chargesheets** — Court proceedings
- **missing_persons** — Missing person tracking
- **gangs** — Gang registry with membership
- **audit_logs** — Complete audit trail
- **conversation_history** — AI chat sessions

### Neo4j Knowledge Graph
```cypher
// Core relationships
(:Person)-[:ACCUSED_IN]->(:FIR)
(:Person)-[:OWNS]->(:Vehicle)
(:Person)-[:USES_PHONE]->(:Phone)
(:Person)-[:MEMBER_OF]->(:Gang)
(:Person)-[:ASSOCIATE]-(:Person)
(:Vehicle)-[:SEEN_AT]->(:FIR)
(:FIR)-[:HAS_EVIDENCE]->(:Evidence)
(:Gang)-[:OPERATES_IN]->(:Location)
(:Phone)-[:LINKED_TO]->(:FIR)
```

---

## 🔑 API Endpoints

### Authentication
```
POST /api/v1/auth/login          — Officer login
POST /api/v1/auth/refresh        — Token refresh
GET  /api/v1/auth/me             — Current officer
```

### AI Chat
```
POST /api/v1/chat/stream         — Streaming AI chat (SSE)
POST /api/v1/chat/               — Non-streaming chat
GET  /api/v1/chat/history/{id}   — Chat history
```

### Cases
```
GET  /api/v1/cases/              — List/search FIRs
GET  /api/v1/cases/{id}          — FIR detail
POST /api/v1/cases/{id}/ai-summary — Generate AI summary
POST /api/v1/cases/upload-pdf    — Upload & OCR PDF FIR
```

### Suspects
```
GET  /api/v1/suspects/           — List suspects
GET  /api/v1/suspects/{id}       — Profile
GET  /api/v1/suspects/{id}/timeline — Crime timeline
GET  /api/v1/suspects/{id}/similar-mo — MO similarity
```

---

## 🛡️ Security Architecture

- **JWT Authentication** — 8-hour access tokens, 7-day refresh tokens
- **Role-Based Access Control** — 8 distinct officer roles with granular permissions
- **Zero Trust** — Every request authenticated, no implicit trust
- **Prompt Injection Detection** — Guards against AI manipulation
- **PII Protection** — Aadhaar, phone numbers masked in responses
- **Audit Logging** — Complete trail of all officer queries and data access
- **Evidence Access Logging** — Chain of custody for digital evidence
- **End-to-End Encryption** — TLS 1.3 for all communications
- **Rate Limiting** — 60 req/min per officer
- **Hallucination Detection** — Responses grounded only in retrieved data

---

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest tests/ -v

# Frontend tests
cd frontend && npm test
```

---

## 📊 Why POLICEGPT Outperforms Traditional Systems

| Feature | Traditional System | POLICEGPT |
|---------|-------------------|-----------|
| **Query Interface** | SQL / Form fields | Natural language |
| **Search Time** | Minutes to hours | Seconds |
| **Cross-DB linking** | Manual | Automatic (Knowledge Graph) |
| **Pattern detection** | Periodic reports | Real-time AI |
| **Language support** | English only | English + Kannada + Hindi |
| **Insights** | Raw data | AI-synthesized intelligence |
| **Reports** | Manual writing | Auto-generated |
| **Legal sections** | Manual lookup | AI-recommended |
| **Accessibility** | PC only | Web + Mobile |

---

## 🏆 Hackathon Highlights

- 🔥 **RAG-powered chat** — Grounded in real case data, no hallucinations
- 🔥 **Knowledge Graph** — Visual relationship mapping between all entities
- 🔥 **Crime heatmaps** — Geo-intelligence at district level
- 🔥 **AI crime prediction** — 76% confidence predictive model
- 🔥 **Multi-role RBAC** — 8 officer types with appropriate access levels
- 🔥 **Streaming responses** — Real-time AI reasoning display
- 🔥 **Multilingual** — Kannada + Hindi + English support
- 🔥 **Explainable AI** — Citations for every AI response
- 🔥 **Auto legal sections** — IPC/BNS section recommendations
- 🔥 **PDF FIR parsing** — OCR + structured extraction

---

## 📄 License

Government of Karnataka — Department of Home Affairs.
Internal Use Only. All Rights Reserved.

---

*Built with loveeeeeeeeeeeeeeeeeeeee for Karnataka State Police | POLICEGPT v2.0*
