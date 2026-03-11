import { describe, expect, it } from 'vitest';
import { buildChatProfileContext, getGeminiErrorMessage } from './geminiService';

describe('buildChatProfileContext', () => {
  it('keeps the context minimal for chatbot personalization', () => {
    const context = buildChatProfileContext({
      name: 'Lia',
      age: 29,
      weight: 68,
      height: 170,
      goal: 'gain_muscle',
      allergies: 'amendoim',
      restrictions: 'sem lactose',
    });

    expect(context).toContain('Objetivo principal: ganhar massa muscular');
    expect(context).toContain('Alergias: amendoim');
    expect(context).toContain('Restrições alimentares: sem lactose');
    expect(context).not.toContain('29');
    expect(context).not.toContain('68');
    expect(context).not.toContain('170');
  });
});

describe('getGeminiErrorMessage', () => {
  it('maps leaked keys to a safe action message', () => {
    const message = getGeminiErrorMessage(new Error('API key was reported as leaked'));

    expect(message).toContain('bloqueada por vazamento');
  });
});