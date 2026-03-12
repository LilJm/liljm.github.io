import React, { Suspense, lazy, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { FirestoreStateError, useFirestore } from './hooks/useFirestore';
import { useTheme } from './hooks/useTheme';
import { UserProfile } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/ui/LoadingScreen';

const Auth = lazy(() => import('./components/Auth'));
const MainApp = lazy(() => import('./MainApp'));
const Onboarding = lazy(() => import('./components/Onboarding'));

const isProfileComplete = (profile: UserProfile | undefined): boolean => {
  if (!profile) return false;
  return profile.age > 0 && profile.weight > 0 && profile.height > 0 && profile.sex !== '';
};

const createDefaultProfile = (name: string): UserProfile => ({
  name,
  age: 0,
  weight: 0,
  height: 0,
  sex: '',
  goal: 'maintain_weight',
  allergies: '',
  restrictions: '',
});

const isPermissionDenied = (error: FirestoreStateError | null): boolean => error?.code === 'permission-denied';

const App: React.FC = () => {
  useTheme(); // Initialize theme hook at the top level
  const { currentUser, loading: authLoading, logout } = useAuth();
  
  const [profile, setProfile, loadingProfile, profileError] = useFirestore<UserProfile | undefined>(
    currentUser?.id || '', 
    'userProfile', 
    undefined
  );

  const resolvedProfile = useMemo(() => {
    if (!currentUser) {
      return undefined;
    }

    return profile ?? createDefaultProfile(currentUser.name);
  }, [currentUser, profile]);

  const handleSaveProfile = async (updatedProfile: UserProfile): Promise<boolean> => {
    return setProfile(updatedProfile);
  };

  if (authLoading || (currentUser && loadingProfile)) {
    return <LoadingScreen label="Carregando..." />;
  }

  if (!currentUser) {
    return (
      <Suspense fallback={<LoadingScreen label="Carregando..." />}>
        <Auth />
      </Suspense>
    );
  }

  if (isPermissionDenied(profileError)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 dark:bg-gray-900">
        <div className="max-w-md rounded-xl bg-surface p-8 shadow-md dark:bg-gray-800">
          <h1 className="mb-3 text-2xl font-bold text-text dark:text-gray-50">Sessão sem permissão</h1>
          <p className="mb-6 text-text-light dark:text-gray-400">{profileError?.message}</p>
          <button onClick={logout} className="rounded-lg bg-primary px-6 py-3 font-bold text-black shadow-md hover:bg-primary-dark">
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  if (!resolvedProfile) {
    return <LoadingScreen label="Preparando seu perfil..." />;
  }

  if (!isProfileComplete(profile)) {
    return (
      <Suspense fallback={<LoadingScreen label="Preparando seu perfil..." />}>
        <Onboarding profile={resolvedProfile} onSave={handleSaveProfile} saveError={profileError?.message ?? null} />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen label="Carregando aplicativo..." />}>
        <MainApp user={currentUser} onLogout={logout} profile={resolvedProfile} onSaveProfile={handleSaveProfile} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
