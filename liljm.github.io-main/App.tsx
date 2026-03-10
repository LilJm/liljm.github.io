import React, { useEffect } from 'react';
import Auth from './components/Auth';
import MainApp from './MainApp';
import Onboarding from './components/Onboarding';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useTheme } from './hooks/useTheme';
import { UserProfile } from './types';

const isProfileComplete = (profile: UserProfile | undefined): boolean => {
  if (!profile) return false;
  return profile.age > 0 && profile.weight > 0 && profile.height > 0;
};

const App: React.FC = () => {
  useTheme(); // Initialize theme hook at the top level
  const { currentUser, loading: authLoading, logout } = useAuth();
  
  const [profile, setProfile, loadingProfile] = useFirestore<UserProfile | undefined>(
    currentUser?.id || '', 
    'userProfile', 
    undefined
  );

  // This effect ensures that when the user logs out, the profile state is also cleared.
  // It also initializes a default profile for a newly logged-in user if one doesn't exist.
  useEffect(() => {
    if (!currentUser) {
      setProfile(undefined);
    } else if (profile === undefined && !loadingProfile) {
      // Initialize default profile for new users
      setProfile({
        name: currentUser.name,
        age: 0,
        weight: 0,
        height: 0,
        goal: 'maintain_weight',
        allergies: '',
        restrictions: '',
      });
    }
  }, [currentUser, profile, setProfile, loadingProfile]);

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  // Show loading screen while authenticating
  if (authLoading || (currentUser && loadingProfile)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth />;
  }
  
  // While profile is being loaded/initialized, render nothing to prevent passing `undefined`
  if (profile === undefined) {
    return null;
  }

  if (!isProfileComplete(profile)) {
    return <Onboarding profile={profile} onSave={handleSaveProfile} />;
  }

  // Converter para o formato User esperado pelo MainApp
  const user = {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    password: '' // Não é mais necessário
  };

  return <MainApp user={user} onLogout={logout} profile={profile} onSaveProfile={handleSaveProfile} />;
};

export default App;
