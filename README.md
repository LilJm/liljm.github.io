<<<<<<< HEAD

1. Install dependencies:
=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NutriAI

Aplicação React + Vite para planejamento alimentar, receitas, hidratação e orientação nutricional com IA.

## Requisitos

- Node.js 20+
- Firebase configurado para Auth e Firestore
- Chave válida do Gemini em ambiente local

## Configuração local

1. Instale as dependências:
>>>>>>> parent of a2c6cc4 (Revert "Refatoração e estruturação nova")
   `npm install`
2. Crie seu arquivo `.env` a partir de `.env.example`.
3. Preencha pelo menos `VITE_GEMINI_API_KEY` e as variáveis do Firebase.
4. Rode o app:
   `npm run dev`

## Scripts

- `npm run dev`: servidor local
- `npm run build`: build de produção
- `npm run preview`: pré-visualização do build
- `npm run lint`: checagem de lint
- `npm run typecheck`: checagem TypeScript
- `npm run test`: testes automatizados
- `npm run format`: formatação com Prettier

## Segurança

- Não versione `.env` ou `.env.local`.
- Se uma chave Gemini ou Firebase tiver sido exposta, gere uma nova antes de continuar.
- O chatbot usa apenas objetivo e restrições alimentares do perfil para personalização básica.

## Produção

- Publique apenas após validar `lint`, `typecheck`, `test` e `build`.
- Revise as regras do Firestore antes de liberar acesso real a usuários.
