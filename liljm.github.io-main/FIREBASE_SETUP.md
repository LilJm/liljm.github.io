# 🔥 Guia de Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome: "NutriAI" (ou outro de sua escolha)
4. Siga os passos e crie o projeto

## Passo 2: Registrar Aplicativo Web

1. No painel do projeto, clique no ícone Web (</>)
2. Digite o nome do app: "NutriAI Web"
3. Marque "Firebase Hosting" se quiser hospedar no Firebase
4. Clique em "Registrar app"
5. **COPIE as configurações** que aparecerem

## Passo 3: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores `your_*_here` pelos valores reais do Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nutriai-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nutriai-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=nutriai-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

## Passo 4: Ativar Firestore Database

1. No menu lateral, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Produção" ou "Teste"
4. Escolha a região (ex: southamerica-east1 para São Paulo)

## Passo 5: Configurar Regras de Segurança

No painel do Firestore, vá em "Regras" e utilize:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cada usuário só pode acessar seus próprios dados
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Passo 6: Ativar Autenticação (Opcional)

1. No menu lateral, vá em "Authentication"
2. Clique em "Vamos começar"
3. Ative os métodos desejados:
   - Email/Senha
   - Google
   - Facebook
   etc.

## Passo 7: Instalar Dependências

```bash
npm install firebase
```

## Passo 8: Usar no Código

### Substituir localStorage por Firestore

Em `MainApp.tsx`, altere:

```typescript
// ANTES (localStorage)
import { useLocalStorage } from './hooks/useLocalStorage';
const [savedPlans, setSavedPlans] = useLocalStorage<MealPlan[]>(`savedPlans${userKeySuffix}`, []);

// DEPOIS (Firestore)
import { useFirestore } from './hooks/useFirestore';
const [savedPlans, setSavedPlans, loadingPlans] = useFirestore<MealPlan[]>(user.id, 'savedPlans', []);
```

## 📊 Comparação: localStorage vs Firebase

| Recurso | localStorage | Firebase |
|---------|--------------|----------|
| Sincronização | ❌ Apenas local | ✅ Entre dispositivos |
| Limite de dados | ~5-10MB | ✅ Praticamente ilimitado |
| Backup | ❌ Não | ✅ Automático |
| Tempo real | ❌ Não | ✅ Sim |
| Autenticação | ❌ Manual | ✅ Integrada |
| Custo | Grátis | Grátis até 1GB |

## 🎯 Próximos Passos

- [ ] Criar projeto no Firebase
- [ ] Configurar .env
- [ ] Ativar Firestore
- [ ] Configurar regras de segurança
- [ ] Atualizar MainApp.tsx
- [ ] Testar sincronização

## 🆘 Problemas Comuns

**Erro: Firebase not initialized**
- Verifique se o .env está configurado corretamente
- Reinicie o servidor de desenvolvimento (`npm run dev`)

**Erro: Permission denied**
- Verifique as regras de segurança no Firestore
- Certifique-se de que o usuário está autenticado

**Dados não sincronizam**
- Verifique a conexão com internet
- Abra o console do navegador para ver erros
