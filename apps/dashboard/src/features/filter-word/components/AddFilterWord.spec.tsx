import { AddFilterWord } from "./AddFilterWord"
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

describe('AddFilterWord Component', () => {
    it('should render form elements corretely', () => {
        render(<AddFilterWord onAddWord={vi.fn()} />);
        expect(screen.getByText('Ajouter un mot ou une expression')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('+ ex: discord.gg/...')).toBeInTheDocument();
    });

    it('should disable the add button when the input is empty', () => {
        render(<AddFilterWord onAddWord={vi.fn()} />);
        const button = screen.getByRole('button', { name: /ajouter/i });
        expect(button).toBeDisabled();
    });
     
    it('Should call onAddWord and clear the input field after submission', () => {
        const mockOnAddWord = vi.fn();
        render(<AddFilterWord onAddWord={mockOnAddWord} />);

        const input = screen.getByPlaceholderText('+ ex: discord.gg/...');
        const button = screen.getByRole('button', { name: /ajouter/i });

        fireEvent.change(input, { target: { value: ' motBanni'} });
        fireEvent.click(button);

        expect(mockOnAddWord).toHaveBeenCalledWith('motBanni');
        expect(input).toHaveValue('');
        
    });
});