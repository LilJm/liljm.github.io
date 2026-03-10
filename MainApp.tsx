import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Planner from './components/Planner';
import Recipes from './components/Recipes';
import SavedPlans from './components/SavedPlans';
import SavedRecipes from './components/SavedRecipes';
import WaterTracker from './components/WaterTracker';
import Home from './components/Home'; // Import the new Home component
import { useFirestore } from './hooks/useFirestore';
import { UserProfile, MealPlan, Recipe, User } from './types';
import Chatbot from './components/Chatbot';
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';

interface MainAppProps {
    user: User;
    onLogout: () => void;
    profile: UserProfile;
    onSaveProfile: (profile: UserProfile) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onLogout, profile, onSaveProfile }) => {
  const [activeView, setActiveView] = useState('home'); // Set 'home' as the default view
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [savedPlans, setSavedPlans, loadingPlans] = useFirestore<MealPlan[]>(user.id, 'savedPlans', []);
  const [savedRecipes, setSavedRecipes, loadingRecipes] = useFirestore<Recipe[]>(user.id, 'savedRecipes', []);

  const handleSavePlan = (plan: MealPlan) => {
    if (!savedPlans.some(p => p.id === plan.id)) {
        const newPlans = [...savedPlans, plan];
        setSavedPlans(newPlans);
    }
  };

  const handleDeletePlan = (planId: string) => {
    setSavedPlans(savedPlans.filter(p => p.id !== planId));
  };

  const handleUpdatePlan = (planId: string, newName: string) => {
    const updatedPlans = savedPlans.map(p => 
      p.id === planId ? { ...p, name: newName } : p
    );
    setSavedPlans(updatedPlans);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    if (!savedRecipes.some(r => r.id === recipe.id)) {
        const newRecipes = [...savedRecipes, recipe];
        setSavedRecipes(newRecipes);
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setSavedRecipes(savedRecipes.filter(r => r.id !== recipeId));
  };

  const handleUpdateRecipe = (recipeId: string, newName: string) => {
    const updatedRecipes = savedRecipes.map(r => 
      r.id === recipeId ? { ...r, name: newName } : r
    );
    setSavedRecipes(updatedRecipes);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Home profile={profile} savedPlans={savedPlans} userId={user.id} onNavigate={setActiveView} />;
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
        return <Home profile={profile} savedPlans={savedPlans} userId={user.id} onNavigate={setActiveView} />;
    }
  };

  // Show loading spinner while data is being fetched from Firestore
  if (loadingPlans || loadingRecipes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background dark:bg-gray-900 min-h-screen font-sans">
      <Sidebar user={user} activeView={activeView} onNavigate={setActiveView} onLogout={onLogout} />
      <main className="flex-1 ml-64">
        {renderContent()}
      </main>
      
      {/* Floating Action Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-8 right-8 z-40 p-4 bg-primary text-black rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-110 animate-fade-in"
          aria-label="Abrir Coach Nutricional"
        >
          <ChatBubbleIcon className="h-8 w-8" />
        </button>
      )}

      {/* Chatbot Window */}
      {isChatbotOpen && (
        <Chatbot
          profile={profile}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}
    </div>
  );
};

export default MainApp;