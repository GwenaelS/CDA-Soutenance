import { fireEvent, render, screen } from "@testing-library/react";
import type { DashboardServer } from "@wystrelia/shared/types";
import { describe } from "vitest";
import { FilterwordPage } from "./FilterwordPage";


const mockServer: DashboardServer = {
    id: 1,
    name: 'Wystrelia',
    icon: 'https://example.com/icon.png',
    gradient: 'from-purple-600 to-cyan-400',
    isActive: true,
    roles: [],
    filterConfig: { words: [{ word: 'test', addedAt: '25/06/2026' }], exemptedRoles: [] }
  
};
describe('FilterwordPage Integration', () => {
    it('Should prevent adding duplicate words case-insensitively', () => {
        render(<FilterwordPage server={mockServer} />);

        const input = screen.getByPlaceholderText('+ ex: discord.gg/...');
        const button = screen.getByRole('button', { name: /ajouter/i });

        fireEvent.change(input, { target: { value: 'test'} });
        fireEvent.click(button);

        const items = screen.getAllByText(/test/i);
        expect(items.length).toBe(1); 
    });
});