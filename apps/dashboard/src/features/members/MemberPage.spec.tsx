import type { DashboardServer } from "@wystrelia/shared/types";
import { MembersPage } from "./MembersPage";
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';


const mockServer: DashboardServer = {
    id: 1,
    name: 'Wystrelia',
    icon: 'https://exemple.com/icon.png',
    gradient: 'from-purple-600 to-cyan-400',
    isActive: true,
    roles: [],
    members: [
        { id: '1', username: 'Arthur', displayName: 'Art', avatarUrl: 'https://example.com/art.png', status: 'online', roles: [], level: 1, levelProgress: 0, joinedAt: '', isBooster: false },
        { id: '2', username: 'Merlin', displayName: 'Merl', avatarUrl: 'https://example.com/merl.png', status: 'offline', roles: [], level: 2, levelProgress: 0, joinedAt: '', isBooster: false }
    ]
};

describe('MembersPage Integration', () => {
    it('Should filter the members list based on search input', () => {
        render(<MembersPage server={mockServer} />);

        const input = screen.getByPlaceholderText('Rechercher un membre');
        fireEvent.change(input, { target: { value: 'Merlin' } });

        expect(screen.getByText('Merlin')).toBeInTheDocument();
        expect(screen.queryByText('Arthur')).not.toBeInTheDocument();
    });
});