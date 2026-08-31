Vamos avançar o backend da NESSA AI para a próxima etapa: persistência das conversas.

Analise primeiro a arquitetura existente e implemente a persistência usando SQLAlchemy e PostgreSQL, mantendo a arquitetura atual e sem alterar o frontend.

Objetivo:

Criar o domínio de conversas e mensagens.

Modelos:

Conversation
- id
- title
- created_at
- updated_at

Message
- id
- conversation_id
- role
- content
- created_at

Relacionamento:
Conversation 1:N Message.

Implemente:

1. Configuração do banco usando variáveis de ambiente.
2. Engine e Session do SQLAlchemy.
3. Models.
4. Schemas Pydantic necessários.
5. Repository/service para acesso aos dados.
6. Integração com o ChatService existente.
7. O POST /api/v1/chat deve aceitar conversation_id opcional.
8. Se não existir conversation_id, criar uma nova conversa.
9. Salvar a mensagem do usuário.
10. Gerar a resposta através do AIProvider existente.
11. Salvar a resposta da NESSA.
12. Retornar os dados necessários para o frontend continuar o fluxo.
13. Criar endpoint para listar conversas.
14. Criar endpoint para obter uma conversa com suas mensagens.
15. Criar endpoint para excluir uma conversa.

Crie testes automatizados para todo o novo fluxo.

Não substitua o MockAIProvider neste momento. A integração com a IA real será feita em uma etapa posterior.

Preserve o comportamento atual de /health e do endpoint de chat, incluindo as validações existentes.

Antes de finalizar, execute toda a suíte de testes e corrija qualquer regressão.
