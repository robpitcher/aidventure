import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Aidventure')).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Aidventure')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<App />);
    expect(screen.getByText('Create Checklist')).toBeInTheDocument();
    expect(screen.getByText('AI Assist')).toBeInTheDocument();
  });
});
