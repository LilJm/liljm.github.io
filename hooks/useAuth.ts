import { useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

const getAuthErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (!(error instanceof FirebaseError)) {
    return fallbackMessage;
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'E-mail ou senha inválidos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexão e tente novamente.';
    case 'auth/missing-email':
      return 'Informe um e-mail para continuar.';
    default:
      return fallbackMessage;
  }
};

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setCurrentUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário'
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar nome do usuário
      await updateProfile(userCredential.user, {
        displayName: name
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      return {
        success: true,
        message: 'Conta criada com sucesso. Enviamos um e-mail de verificação. Confirme seu e-mail para acessar sua conta.',
      };
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error, 'Erro ao criar conta.') };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        try {
          await sendEmailVerification(userCredential.user);
        } catch {
          // Ignore resend failures (e.g. throttle) and keep the verification requirement message.
        }
        await signOut(auth);

        return {
          success: false,
          message: 'Seu e-mail ainda nao foi verificado. Reenviamos o link de confirmacao. Valide o e-mail para entrar.',
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error, 'E-mail ou senha inválidos.') };
    }
  };

  const resendVerificationEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (!email || !password) {
      return {
        success: false,
        message: 'Informe e-mail e senha para reenviar a verificacao.',
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();

      if (userCredential.user.emailVerified) {
        await signOut(auth);
        return {
          success: true,
          message: 'Seu e-mail ja esta verificado. Agora voce pode entrar normalmente.',
        };
      }

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      return {
        success: true,
        message: 'E-mail de verificacao reenviado com sucesso. Verifique sua caixa de entrada.',
      };
    } catch (error) {
      return {
        success: false,
        message: getAuthErrorMessage(error, 'Nao foi possivel reenviar o e-mail de verificacao.'),
      };
    }
  };

  const sendPasswordReset = async (email: string): Promise<AuthResult> => {
    if (!email) {
      return {
        success: false,
        message: 'Informe seu e-mail para recuperar a senha.',
      };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Enviamos o link para redefinir sua senha. Verifique seu e-mail.',
      };
    } catch (error) {
      return {
        success: false,
        message: getAuthErrorMessage(error, 'Nao foi possivel enviar o e-mail de recuperacao de senha.'),
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    currentUser,
    loading,
    register,
    login,
    resendVerificationEmail,
    sendPasswordReset,
    logout
  };
}
