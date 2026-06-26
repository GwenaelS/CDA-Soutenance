import { fireEvent, render, screen } from "@testing-library/react";
import { FilterWordList } from "./FilterWordList";
import { vi } from 'vitest';
import '@testing-library/jest-dom';

const mockWords = [
    { word: 'LienInterdit', addedAt: '25/06/2026'},
];

describe('FilterWordList Component', () => {
    it('Should render fallback message when the list is empty'
, () => {
    render(<FilterWordList words={[]} onDeleteWord={vi.fn()} />);
    expect(screen.getByText('Aucun mot filtré sur ce serveur.')).toBeInTheDocument();
});

    it('should display words and call onDeleteWord when the delete button is clicked', () =>{
        const mockOnDelete = vi.fn();
        render(<FilterWordList words={mockWords} onDeleteWord={mockOnDelete} />);

        expect(screen.getByText('LienInterdit')).toBeInTheDocument();

        const deleteBtn = screen.getByTitle('Supprimer');
        fireEvent.click(deleteBtn);

        expect(mockOnDelete).toHaveBeenCalledWith('LienInterdit');
    });
});
