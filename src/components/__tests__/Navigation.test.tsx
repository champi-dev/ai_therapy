import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders navigation with logo and session timer', () => {
    render(<Navigation />);

    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Therapy')).toBeInTheDocument();
    expect(screen.getByText(/Session:/)).toBeInTheDocument();
  });

  it('displays formatted session time', () => {
    render(<Navigation />);

    expect(screen.getByText('Session: 00:00')).toBeInTheDocument();
  });

  it('toggles dark mode when button is clicked', () => {
    render(<Navigation />);

    const darkModeButton = screen.getByLabelText('Toggle dark mode');

    fireEvent.click(darkModeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(darkModeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('shows breathing indicator', () => {
    const { container } = render(<Navigation />);

    const breathingDot = container.querySelector('.animate-breathe');
    const pingDot = container.querySelector('.animate-ping');

    expect(breathingDot).toBeInTheDocument();
    expect(pingDot).toBeInTheDocument();
  });
});
