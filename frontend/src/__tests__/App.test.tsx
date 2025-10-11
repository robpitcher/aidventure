import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Aidventure Pack Planner')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(screen.getByText('AI Adventure Racing Assistant')).toBeInTheDocument();
  });

  it('renders the demo component with loading state', () => {
    render(<App />);
    expect(screen.getByText(/Loading checklists.../i)).toBeInTheDocument();
  });
});
