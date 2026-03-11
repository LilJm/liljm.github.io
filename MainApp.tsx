import React, { Suspense, lazy, startTransition, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useFirestore } from './hooks/useFirestore';
import LoadingScreen from './components/ui/LoadingScreen';
import { UserProfile, MealPlan, Recipe, SessionUser } from './types';
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';

const Profile = lazy(() => import('./components/Profile'));
const Planner = lazy(() => import('./components/Planner'));
const Recipes = lazy(() => import('./components/Recipes'));
const SavedPlans = lazy(() => import('./components/SavedPlans'));
const SavedRecipes = lazy(() => import('./components/SavedRecipes'));
const WaterTracker = lazy(() => import('./components/WaterTracker'));
const Home = lazy(() => import('./components/Home'));
const Chatbot = lazy(() => import('./components/Chatbot'));

interface MainAppProps {
    user: SessionUser;
    onLogout: () => void;
    profile: UserProfile;
    onSaveProfile: (profile: UserProfile) => Promise<boolean>;
}

const MainApp: React.FC<MainAppProps> = ({ user, onLogout, profile, onSaveProfile }) => {
  const [activeView, setActiveView] = useState('home'); // Set 'home' as the default view
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [savedPlans, setSavedPlans, loadingPlans, savedPlansError] = useFirestore<MealPlan[]>(user.id, 'savedPlans', []);
  const [savedRecipes, setSavedRecipes, loadingRecipes, savedRecipesError] = useFirestore<Recipe[]>(user.id, 'savedRecipes', []);

  const handleSavePlan = async (plan: MealPlan): Promise<boolean> => {
    if (!savedPlans.some(p => p.id === plan.id)) {
        return setSavedPlans([...savedPlans, plan]);
    }

    return true;
  };

  const handleDeletePlan = async (planId: string): Promise<boolean> => {
    return setSavedPlans(savedPlans.filter(p => p.id !== planId));
  };

  const handleUpdatePlan = async (planId: string, newName: string): Promise<boolean> => {
    const updatedPlans = savedPlans.map(p => 
      p.id === planId ? { ...p, name: newName } : p
    );
    return setSavedPlans(updatedPlans);
  };

  const handleSaveRecipe = async (recipe: Recipe): Promise<boolean> => {
    if (!savedRecipes.some(r => r.id === recipe.id)) {
        return setSavedRecipes([...savedRecipes, recipe]);
    }

    return true;
  };

  const handleDeleteRecipe = async (recipeId: string): Promise<boolean> => {
    return setSavedRecipes(savedRecipes.filter(r => r.id !== recipeId));
  };

  const handleUpdateRecipe = async (recipeId: string, newName: string): Promise<boolean> => {
    const updatedRecipes = savedRecipes.map(r => 
      r.id === recipeId ? { ...r, name: newName } : r
    );
    return setSavedRecipes(updatedRecipes);
  };

  const handleNavigate = (view: string) => {
    startTransition(() => {
      setActiveView(view);
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Home profile={profile} savedPlans={savedPlans} userId={user.id} onNavigate={handleNavigate} />;
      case 'planner':
        return <Planner profile={profile} onSavePlan={handleSavePlan} />;
      case 'recipes':
        return <Recipes onSaveRecipe={handleSaveRecipe} />;
      case 'water':
        return <WaterTracker profile={profile} userId={user.id} />;
      case 'saved':
        return <SavedPlans savedPlans={savedPlans} onDeletePlan={handleDeletePlan} onUpdatePlan={handleUpdatePlan} />;
      case 'saved_recipes':
        return <SavedRecipes savedRecipes={savedRecipes} onDeleteRecipe={handleDeleteRecipe} onUpdateRecipe={handleUpdateRecipe} />;
      case 'profile':
        return <Profile profile={profile} onSave={onSaveProfile} />;
      default:
        return <Home profile={profile} savedPlans={savedPlans} userId={user.id} onNavigate={handleNavigate} />;
    }
  };

  const isDataLoading = loadingPlans || loadingRecipes;
  const dataError = savedPlansError ?? savedRecipesError;

  return (
    <div className="flex bg-background dark:bg-gray-900 min-h-screen font-sans">
      <Sidebar user={user} activeView={activeView} onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="flex-1 ml-64">
        {isDataLoading && (
          <div className="mx-4 mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 md:mx-8">
            Carregando seus dados salvos em segundo plano...
          </div>
        )}
        {dataError && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 md:mx-8">
            {dataError.message}
          </div>
        )}
        <Suspense fallback={<LoadingScreen label="Abrindo seção..." compact />}>
          {renderContent()}
        </Suspense>
      </main>
      
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-8 right-8 z-40 p-4 bg-primary text-black rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-110 animate-fade-in"
          aria-label="Abrir Coach Nutricional"
        >
          <ChatBubbleIcon className="h-8 w-8" />
        </button>
      )}

      {isChatbotOpen && (
        <Suspense fallback={<LoadingScreen label="Abrindo coach..." compact overlay />}>
          <Chatbot
            profile={profile}
            onClose={() => setIsChatbotOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default MainApp;