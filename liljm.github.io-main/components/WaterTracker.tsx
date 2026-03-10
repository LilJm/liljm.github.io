import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useDailyLocalStorage } from '../hooks/useDailyLocalStorage';
import Card from './ui/Card';
import { DropletIcon } from './icons/DropletIcon';

interface WaterTrackerProps {
  profile: UserProfile;
  userId: string;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ profile, userId }) => {
  const dailyGoal = profile.weight > 0 ? Math.round(profile.weight * 35) : 2000;
  const [currentIntake, setCurrentIntake] = useDailyLocalStorage<number>(`waterIntake_${userId}`, 0);
  const [customAmount, setCustomAmount] = useState('');

  const progress = dailyGoal > 0 ? Math.min((currentIntake / dailyGoal) * 100, 100) : 0;
  const isGoalReached = currentIntake >= dailyGoal;

  const addWater = (amount: number) => {
    setCurrentIntake(prev => prev + amount);
  };

  const handleAddCustomAmount = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      addWater(amount);
      setCustomAmount('');
    }
  };
  
  const getMotivationalMessage = () => {
    if (isGoalReached) return "Parabéns! Você atingiu sua meta de hidratação!";
    if (progress > 75) return "Você está quase lá, continue assim!";
    if (progress > 50) return "Ótimo! Você já passou da metade.";
    if (progress > 25) return "Bom começo! Continue se hidratando.";
    return "Um gole de cada vez. Comece a registrar seu consumo de água!";
  };

  if (profile.weight <= 0) {
      return (
          <div className="p-4 md:p-8 text-center">
              <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-4">Controle de Água</h1>
              <p className="text-text-light dark:text-gray-400">
                  Por favor, insira seu peso na aba <span className="font-semibold text-primary">'Perfil'</span> para que possamos calcular sua meta de hidratação diária.
              </p>
          </div>
      )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-2">Controle de Ingestão de Água</h1>
      <p className="text-text-light dark:text-gray-400 mb-8">Lembre-se: hidratação é fundamental para sua saúde e bem-estar.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-text dark:text-gray-50">Seu Progresso Diário</h2>
                        <span className="font-bold text-primary text-lg">
                            Meta: {dailyGoal} ml
                        </span>
                    </div>
                    <div className="text-center mb-4">
                        <p className="text-5xl font-extrabold text-primary-dark">{currentIntake}<span className="text-2xl text-text-light dark:text-gray-400">ml</span></p>
                        <p className="text-text-light dark:text-gray-400 mt-2">{getMotivationalMessage()}</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                    <div
                        className={`transition-all duration-500 h-8 rounded-full flex items-center justify-center ${isGoalReached ? 'bg-accent' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                    >
                       <span className="font-bold text-black text-sm">{Math.round(progress)}%</span>
                    </div>
                </div>
            </Card>
        </div>
        
        <Card>
            <h2 className="text-xl font-bold text-text dark:text-gray-50 mb-4 flex items-center">
                <DropletIcon className="w-6 h-6 mr-2 text-primary" />
                Registrar Consumo
            </h2>
            <div className="space-y-3">
                <button onClick={() => addWater(250)} className="w-full py-3 bg-primary-light text-primary-dark font-semibold rounded-lg hover:opacity-80 transition-opacity">
                    + 250 ml (1 copo)
                </button>
                <button onClick={() => addWater(500)} className="w-full py-3 bg-primary-light text-primary-dark font-semibold rounded-lg hover:opacity-80 transition-opacity">
                    + 500 ml (1 garrafa pequena)
                </button>
                <button onClick={() => addWater(750)} className="w-full py-3 bg-primary-light text-primary-dark font-semibold rounded-lg hover:opacity-80 transition-opacity">
                    + 750 ml (1 garrafa média)
                </button>

                <div className="pt-3">
                  <label htmlFor="custom-amount" className="block text-sm font-medium text-text-light dark:text-gray-400 mb-1">
                      Adicionar quantidade customizada (ml)
                  </label>
                  <div className="flex items-center space-x-2">
                      <input
                          type="number"
                          id="custom-amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Ex: 2000"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400"
                      />
                      <button
                          onClick={handleAddCustomAmount}
                          disabled={!customAmount || parseInt(customAmount, 10) <= 0}
                          className="px-4 py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                      >
                          Adicionar
                      </button>
                  </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default WaterTracker;