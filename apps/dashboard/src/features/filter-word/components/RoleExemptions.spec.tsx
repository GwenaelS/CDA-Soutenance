import { RoleExemptions } from "./RoleExemptions";
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

const mockRoles = [
    { name: 'Admin', color: '#ff0000' },
    { name: 'Modo', color: '#00ff00' },
];

describe('RoleExemptions Component', () => {
    it('Should correctly separate exempted roles from avaible roles', () => {
    render(
        <RoleExemptions 
        serverRoles={mockRoles}
        exemptedRoles={['Admin']}
        onAddExemptedRole={vi.fn()}
        onRemoveExemptedRole={vi.fn()}
        />
    );

    expect(screen.getByText('1 exempté(s)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sélectionner un rôle/i })).toBeInTheDocument();
    });
});