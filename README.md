# NESSA AI

> Plataforma de inteligência artificial em desenvolvimento, construída com Angular e FastAPI.

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🌐 Demo

**Aplicação:**  
https://nessa-ai.vercel.app/

---

## 📖 Sobre o projeto

A **NESSA AI** é uma plataforma de inteligência artificial desenvolvida com foco em uma experiência moderna de conversação e uma arquitetura preparada para evolução.

O projeto está sendo construído de forma incremental, separando frontend e backend e utilizando uma arquitetura baseada em serviços e provedores de IA.

O objetivo é criar uma aplicação completa de conversação com:

- Interface moderna de chat
- Conversas e histórico
- API REST
- Persistência de dados
- Integração com provedores de IA
- Arquitetura escalável
- Testes automatizados

---

## ✨ Funcionalidades

### Frontend

- [x] Interface principal da aplicação
- [x] Layout responsivo
- [x] Interface de chat
- [x] Estrutura modular com Angular
- [x] Componentes standalone
- [x] Organização por features

### Backend

- [x] API com FastAPI
- [x] Endpoint `/health`
- [x] Endpoint `POST /api/v1/chat`
- [x] Validação de mensagens
- [x] Arquitetura baseada em serviços
- [x] Abstração de provedor de IA
- [x] Mock AI Provider
- [x] Testes automatizados
- [ ] Persistência de conversas
- [ ] PostgreSQL
- [ ] Histórico de conversas
- [ ] Autenticação
- [ ] Integração com IA real
- [ ] Streaming de respostas

---

## 🛠️ Tecnologias

### Frontend

- Angular
- TypeScript
- HTML5
- SCSS
- Vite

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- PostgreSQL

### Desenvolvimento

- Git
- GitHub
- Visual Studio Code

---

## 🏗️ Arquitetura

O projeto é dividido em frontend e backend:

```text
nessa-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── tests/
│
├── public/
│
├── src/
│   └── app/
│       ├── core/
│       ├── features/
│       ├── layout/
│       └── shared/
│
├── tools/
│
├── angular.json
├── package.json
└── README.md
