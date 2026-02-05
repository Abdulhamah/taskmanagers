import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || 'sk-test-key'
});

export async function getTaskDescription(title: string): Promise<{ description: string; category: string }> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Given this task title: "${title}", provide a brief helpful description and suggest a category (work, personal, shopping, health, or other). Respond in JSON format: {"description": "...", "category": "..."}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        return {
          description: parsed.description || '',
          category: parsed.category || 'other'
        };
      } catch {
        return { description: '', category: 'other' };
      }
    }
    return { description: '', category: 'other' };
  } catch (error) {
    console.error('AI assistance error:', error);
    return { description: '', category: 'other' };
  }
}

export async function getTaskSuggestion(title: string, description: string, status: string): Promise<string> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Task: "${title}"\nDescription: "${description}"\nStatus: ${status}\n\nProvide a brief actionable suggestion to help with this task.`
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
  } catch (error) {
    console.error('AI suggestion error:', error);
    return '';
  }
}

export async function getTaskAnalysis(tasks: Array<{ title: string; status: string; priority: string }>): Promise<string> {
  try {
    const taskList = tasks.map(t => `- ${t.title} (${t.priority} priority, ${t.status})`).join('\n');
    
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Analyze this task list and provide a brief insight about task distribution and productivity:\n${taskList}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
  } catch (error) {
    console.error('AI analysis error:', error);
    return '';
  }
}
