import React, { useState } from 'react';
import { Recipe, NutritionInfo } from '../types';
import Card from './ui/Card';
import { DownloadIcon } from './icons/DownloadIcon';
import jsPDF from 'jspdf';

interface SavedRecipesProps {
  savedRecipes: Recipe[];
  onDeleteRecipe: (recipeId: string) => void;
  onUpdateRecipe: (recipeId: string, newName: string) => void;
}

const NutritionPill: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-primary-light text-primary-dark text-sm font-medium px-3 py-1 rounded-full">
      {label}: {value}
    </div>
);

const SavedRecipes: React.FC<SavedRecipesProps> = ({ savedRecipes, onDeleteRecipe, onUpdateRecipe }) => {
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const toggleRecipe = (recipeId: string) => {
    if (editingRecipeId === recipeId) return;
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };
  
  const handleSaveName = (recipeId: string) => {
    if (editingName.trim()) {
      onUpdateRecipe(recipeId, editingName.trim());
      setEditingRecipeId(null);
    }
  };

  const handleDownloadRecipePDF = (recipe: Recipe) => {
    const doc = new jsPDF();
    const margin = 15;
    const page_width = doc.internal.pageSize.getWidth();
    let y = 20;

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 280) {
            doc.addPage();
            y = 20;
        }
    }

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(recipe.name, 180);
    doc.text(titleLines, page_width / 2, y, { align: 'center' });
    y += titleLines.length * 8 + 2;

    // Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    const descriptionLines = doc.splitTextToSize(recipe.description, 170);
    doc.text(descriptionLines, page_width / 2, y, { align: 'center' });
    y += descriptionLines.length * 5 + 10;
    doc.setTextColor(0);

    // Prep time, cook time, servings
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const infoText = `Tempo de Preparo: ${recipe.prepTime} | Tempo de Cozimento: ${recipe.cookTime} | Porções: ${recipe.servings}`;
    doc.text(infoText, page_width / 2, y, { align: 'center' });
    y += 15;
    
    // Nutrition Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informação Nutricional (por porção)', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const nutritionText = `  • Calorias: ${recipe.nutrition.calories} kcal\n  • Proteínas: ${recipe.nutrition.protein}g\n  • Carboidratos: ${recipe.nutrition.carbs}g\n  • Gorduras: ${recipe.nutrition.fat}g`;
    doc.text(nutritionText, margin, y);
    y += 25;

    checkPageBreak(30);

    // Ingredients
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Ingredientes', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    recipe.ingredients.forEach(item => {
        const itemLines = doc.splitTextToSize(`• ${item}`, 180);
        checkPageBreak(itemLines.length * 5);
        doc.text(itemLines, margin, y);
        y += itemLines.length * 4 + 1;
    });

    y += 10;
    checkPageBreak(30);

    // Instructions
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Instruções', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    recipe.instructions.forEach((step, index) => {
        const stepLines = doc.splitTextToSize(`${index + 1}. ${step}`, 180);
        checkPageBreak(stepLines.length * 5 + 3);
        doc.text(stepLines, margin, y);
        y += stepLines.length * 4 + 3;
    });

    const fileName = `Receita-NutriAI-${recipe.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    doc.save(fileName);
  };


  if (savedRecipes.length === 0) {
    return (
        <div className="p-4 md:p-8 text-center">
            <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-2">Receitas Salvas</h1>
            <p className="text-text-light dark:text-gray-400 mt-8">Você ainda não salvou nenhuma receita.</p>
            <p className="text-text-light dark:text-gray-400">Vá para a seção de Receitas para gerar e salvar suas favoritas!</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-text dark:text-gray-50 mb-8">Suas Receitas Salvas</h1>
      <div className="space-y-4">
        {savedRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <div className="cursor-pointer" onClick={() => toggleRecipe(recipe.id)}>
              <div className="flex justify-between items-center">
                {editingRecipeId === recipe.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xl font-bold text-primary-dark p-1 border border-primary rounded-md flex-grow dark:bg-gray-700 dark:text-gray-50"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-bold text-primary-dark">{recipe.name}</h2>
                )}
                <div className="flex items-center space-x-4 ml-4">
                  {editingRecipeId === recipe.id ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleSaveName(recipe.id); }} className="text-sm text-green-600 hover:text-green-800 font-semibold">Salvar</button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingRecipeId(null); }} className="text-sm text-gray-600 hover:text-gray-800 font-semibold">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button title="Baixar PDF" onClick={(e) => { e.stopPropagation(); handleDownloadRecipePDF(recipe); }} className="text-gray-500 hover:text-primary"><DownloadIcon className="w-5 h-5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingRecipeId(recipe.id); setEditingName(recipe.name); setExpandedRecipeId(recipe.id); }} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">Renomear</button>
                      <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Tem certeza que deseja excluir a receita "${recipe.name}"?`)) {
                                    onDeleteRecipe(recipe.id);
                                }
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                        >
                            Excluir
                        </button>
                      <span className={`transform transition-transform text-text-light dark:text-gray-400 ${expandedRecipeId === recipe.id ? 'rotate-180' : ''}`}>▼</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {expandedRecipeId === recipe.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                 <p className="text-text-light dark:text-gray-400 mb-4">{recipe.description}</p>
                 <div className="flex flex-wrap gap-4 mb-6 text-sm text-text dark:text-gray-50">
                    <span className="font-semibold">Preparo: {recipe.prepTime}</span>
                    <span className="font-semibold">Cozimento: {recipe.cookTime}</span>
                    <span className="font-semibold">Porções: {recipe.servings}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    <NutritionPill label="Calorias" value={recipe.nutrition.calories} />
                    <NutritionPill label="Proteína" value={`${recipe.nutrition.protein}g`} />
                    <NutritionPill label="Carbs" value={`${recipe.nutrition.carbs}g`} />
                    <NutritionPill label="Gordura" value={`${recipe.nutrition.fat}g`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-bold text-text dark:text-gray-50 mb-3">Ingredientes</h3>
                        <ul className="list-disc pl-5 space-y-2 text-text-light dark:text-gray-400">
                            {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-text dark:text-gray-50 mb-3">Instruções</h3>
                        <ol className="list-decimal pl-5 space-y-3 text-text-light dark:text-gray-400">
                            {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
                        </ol>
                    </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;