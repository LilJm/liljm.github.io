import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Card from './ui/Card';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-8">Seu Perfil</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-gray-400">Nome</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="Seu nome" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-text-light dark:text-gray-400">Idade</label>
              <input type="number" name="age" id="age" value={formData.age || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="Sua idade" />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-text-light dark:text-gray-400">Peso (kg)</label>
              <input type="number" name="weight" id="weight" value={formData.weight || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="Seu peso" />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-text-light dark:text-gray-400">Altura (cm)</label>
              <input type="number" name="height" id="height" value={formData.height || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="Sua altura" />
            </div>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-text-light dark:text-gray-400">Objetivo Principal</label>
            <select name="goal" id="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50">
              <option value="lose_weight">Perder Peso</option>
              <option value="maintain_weight">Manter Peso</option>
              <option value="gain_muscle">Ganhar Massa Muscular</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-text-light dark:text-gray-400">Alergias (separadas por vírgula)</label>
            <textarea name="allergies" id="allergies" value={formData.allergies || ''} onChange={handleChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="ex: amendoim, glúten"></textarea>
          </div>
          
          <div>
            <label htmlFor="restrictions" className="block text-sm font-medium text-text-light dark:text-gray-400">Restrições Alimentares (ex: vegetariano, sem lactose)</label>
            <textarea name="restrictions" id="restrictions" value={formData.restrictions || ''} onChange={handleChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400" placeholder="ex: vegetariano"></textarea>
          </div>

          <div className="flex justify-end items-center">
            {saved && <span className="text-green-600 mr-4 transition-opacity duration-300">Perfil salvo com sucesso!</span>}
            <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Salvar Alterações
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
