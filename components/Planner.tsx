import React, { useState } from 'react';
import { UserProfile, MealPlan, Meal, NutritionInfo } from '../types';
import { generateMealPlan, replaceMeal } from '../services/geminiService';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ReplaceIcon } from './icons/ReplaceIcon';
import { BrainIcon } from './icons/BrainIcon';

interface PlannerProps {
  profile: UserProfile;
  onSavePlan: (plan: MealPlan) => void;
}

const NutritionPill: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-primary-light text-primary-dark text-sm font-medium px-3 py-1 rounded-full">
      {label}: {value}
    </div>
);

const MealCard: React.FC<{
  title: string;
  meal: Meal;
  onReplace: () => void;
  isReplacing: boolean;
}> = ({ title, meal, onReplace, isReplacing }) => (
  <Card>
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-text dark:text-gray-50">{title}</h3>
      <button 
        onClick={onReplace} 
        disabled={isReplacing}
        className="flex items-center text-sm text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-wait"
      >
        <ReplaceIcon className="w-4 h-4 mr-1" />
        {isReplacing ? 'Trocando...' : 'Trocar'}
      </button>
    </div>
    <div className="mt-2">
      <h4 className="text-lg font-semibold text-primary-dark">{meal.name}</h4>
      <p className="text-text-light dark:text-gray-400 text-sm mt-1">{meal.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
          <NutritionPill label="Cal" value={meal.nutrition.calories} />
          <NutritionPill label="P" value={`${meal.nutrition.protein}g`} />
          <NutritionPill label="C" value={`${meal.nutrition.carbs}g`} />
          <NutritionPill label="G" value={`${meal.nutrition.fat}g`} />
      </div>
    </div>
  </Card>
);

const Planner: React.FC<PlannerProps> = ({ profile, onSavePlan }) => {
  const [request, setRequest] = useState('');
  const [mealPlan, setMealPlan] = useState<Omit<MealPlan, 'id'> | null>(null);
  const [loading, setLoading] = useState(false);
  const [replacingMeal, setReplacingMeal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const examplePrompts = [
    "Um dia com foco em proteínas para ganho de massa",
    "Plano com poucas calorias para um dia de descanso",
    "Refeições vegetarianas simples e rápidas",
    "Um dia de alimentação balanceada e saborosa"
  ];

  const handleGeneratePlan = async () => {
    if (!request.trim()) {
        setError("Por favor, descreva o que você gostaria no seu plano alimentar.");
        return;
    }
    setLoading(true);
    setError(null);
    setMealPlan(null);
    setIsSaved(false);
    try {
      const plan = await generateMealPlan(profile, request);
      setMealPlan(plan);
    } catch (err) {
      console.error(err);
      setError("Desculpe, não consegui gerar um plano com esse pedido. Tente ser mais específico ou diferente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceMeal = async (mealKey: 'breakfast' | 'lunch' | 'dinner' | `snacks.${number}`) => {
    if (!mealPlan) return;
    
    setReplacingMeal(mealKey);
    setError(null);

    const mealName = mealKey.includes('snacks') ? 'Lanche' : 
                     mealKey === 'breakfast' ? 'Café da Manhã' :
                     mealKey === 'lunch' ? 'Almoço' : 'Jantar';
    
    try {
        const newMeal = await replaceMeal(profile, mealName, mealPlan);

        setMealPlan(prevPlan => {
            if (!prevPlan) return null;

            const updatedPlan = { ...prevPlan, dailyPlan: { ...prevPlan.dailyPlan, snacks: [...(prevPlan.dailyPlan.snacks || [])] } };
            
            if (mealKey.startsWith('snacks.')) {
              const index = parseInt(mealKey.split('.')[1], 10);
              if (updatedPlan.dailyPlan.snacks) {
                updatedPlan.dailyPlan.snacks[index] = newMeal;
              }
            } else {
              updatedPlan.dailyPlan[mealKey as 'breakfast' | 'lunch' | 'dinner'] = newMeal;
            }

            // Recalculate total nutrition
            let total: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            const meals = [updatedPlan.dailyPlan.breakfast, updatedPlan.dailyPlan.lunch, updatedPlan.dailyPlan.dinner, ...(updatedPlan.dailyPlan.snacks || [])];
            meals.forEach(m => {
                if(m) {
                    total.calories += m.nutrition.calories;
                    total.protein += m.nutrition.protein;
                    total.carbs += m.nutrition.carbs;
                    total.fat += m.nutrition.fat;
                }
            });
            updatedPlan.totalNutrition = total;

            return updatedPlan;
        });

    } catch (err) {
        console.error(err);
        setError(`Falha ao substituir ${mealName}. Tente novamente.`);
    } finally {
        setReplacingMeal(null);
    }
  };

  const handleSavePlan = () => {
    if (mealPlan) {
        onSavePlan({ ...mealPlan, id: new Date().toISOString() });
        setIsSaved(true);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-2">Planejador de Refeições IA</h1>
      <p className="text-text-light dark:text-gray-400 mb-8">Descreva seu dia ideal, e a IA criará um plano alimentar personalizado.</p>
      
      <Card className="mb-8">
        <div className="space-y-4">
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="ex: 'Quero um dia com refeições leves, ricas em fibras e com um jantar baixo em carboidratos.'"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400"
            rows={3}
          />
           <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-light dark:text-gray-400 my-auto">Ideias:</span>
            {examplePrompts.map(p => (
                <button key={p} onClick={() => setRequest(p)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
                    {p}
                </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="px-8 py-3 bg-primary text-black font-bold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                {loading ? 'Gerando Plano...' : 'Gerar Plano Alimentar'}
            </button>
          </div>
        </div>
      </Card>

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center my-4">{error}</p>}
      
      {mealPlan && (
        <div className="animate-fade-in space-y-8">
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-primary-dark">{mealPlan.name}</h2>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <NutritionPill label="Total Calorias" value={mealPlan.totalNutrition.calories} />
                            <NutritionPill label="Total Proteína" value={`${mealPlan.totalNutrition.protein}g`} />
                            <NutritionPill label="Total Carbs" value={`${mealPlan.totalNutrition.carbs}g`} />
                            <NutritionPill label="Total Gordura" value={`${mealPlan.totalNutrition.fat}g`} />
                        </div>
                    </div>
                     <button 
                        onClick={handleSavePlan}
                        disabled={isSaved}
                        className="px-6 py-2 bg-accent text-black font-semibold rounded-md shadow-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap ml-4"
                    >
                        {isSaved ? 'Plano Salvo!' : 'Salvar Plano'}
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MealCard title="Café da Manhã" meal={mealPlan.dailyPlan.breakfast} onReplace={() => handleReplaceMeal('breakfast')} isReplacing={replacingMeal === 'breakfast'} />
                <MealCard title="Almoço" meal={mealPlan.dailyPlan.lunch} onReplace={() => handleReplaceMeal('lunch')} isReplacing={replacingMeal === 'lunch'} />
                <MealCard title="Jantar" meal={mealPlan.dailyPlan.dinner} onReplace={() => handleReplaceMeal('dinner')} isReplacing={replacingMeal === 'dinner'} />
                {mealPlan.dailyPlan.snacks?.map((snack, index) => (
                    <MealCard key={index} title={`Lanche ${index + 1}`} meal={snack} onReplace={() => handleReplaceMeal(`snacks.${index}`)} isReplacing={replacingMeal === `snacks.${index}`} />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold text-text dark:text-gray-50 mb-3 flex items-center"><ClipboardListIcon className="w-6 h-6 mr-2 text-primary" />Lista de Compras</h3>
                    <ul className="list-disc pl-5 space-y-1 text-text-light dark:text-gray-400 columns-2">
                        {mealPlan.shoppingList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </Card>
                 <Card>
                    <h3 className="text-xl font-bold text-text dark:text-gray-50 mb-3 flex items-center"><BrainIcon className="w-6 h-6 mr-2 text-primary" />Sugestões de Substituição</h3>
                     <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-gray-400">
                        {mealPlan.substitutions.map((sub, i) => <li key={i}><strong>{sub.original}:</strong> {sub.replacement}</li>)}
                    </ul>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
