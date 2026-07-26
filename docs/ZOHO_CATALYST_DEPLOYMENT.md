# POLICEGPT — Zoho Catalyst Deployment Guide

This guide explains how to deploy **POLICEGPT** to **Zoho Catalyst** using **AppSail** (Zoho Catalyst Container/PaaS Service).

---

## 📁 Required Zoho Catalyst Files Created

1. `catalyst.json` (Root Catalyst project configuration file)
2. `backend/appsail-config.json` (Backend Python AppSail service config)
3. `frontend/appsail-config.json` (Frontend Next.js AppSail service config)

---

## 🛠️ Step 1: Install Zoho Catalyst CLI

Install the official Catalyst CLI globally:

```bash
npm install -g zcatalyst-cli
```

Verify the installation:

```bash
catalyst --version
```

---

## 🔐 Step 2: Login & Initialize Catalyst Project

1. Log into your Zoho Catalyst account:

```bash
catalyst login
```

2. Associate your local repo with your Catalyst project:

```bash
catalyst init
```

- Select your **Catalyst Project** from the CLI prompt.
- Select **AppSail** as the service type.

---

## 🚀 Step 3: Deploy to Zoho Catalyst AppSail

### Deploy Both Frontend & Backend Together:

```bash
catalyst deploy
```

### Deploy Standalone Backend:

```bash
cd backend
catalyst deploy --type appsail
```

### Deploy Standalone Frontend:

```bash
cd frontend
catalyst deploy --type appsail
```

---

## 🌐 Step 4: Configure Environment Variables in Catalyst Console

1. Open the [Zoho Catalyst Console](https://catalyst.zoho.com).
2. Go to **AppSail** → **policegpt-backend** → **Environment Variables**:
   - `SECRET_KEY`: Your 64-character JWT secret
   - `DATABASE_URL`: PostgreSQL connection string (e.g. Supabase, ElephantSQL, or AWS RDS)
   - `REDIS_URL`: Redis URI (e.g. Upstash Redis)
   - `NEO4J_URI`: Neo4j Aura URI (e.g. `bolt+s://xxx.databases.neo4j.io`)
   - `OLLAMA_BASE_URL` or `OPENAI_API_KEY`: LLM API endpoint key
3. Go to **AppSail** → **policegpt-frontend** → **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Set to your deployed backend AppSail URL (e.g. `https://policegpt-backend.appsail.io`)

---

## ✅ Step 5: Access Your Live Application

Your app will be live at the generated Catalyst AppSail URLs:
- **Frontend**: `https://policegpt-frontend.catalystserverless.com`
- **Backend API Docs**: `https://policegpt-backend.catalystserverless.com/docs`
