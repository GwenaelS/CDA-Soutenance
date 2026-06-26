import { fireEvent, render, screen } from "@testing-library/react";
import { MemberRow } from "./MemberRow";
import { vi } from 'vitest';
import type { Member } from "@wystrelia/shared/types";
import '@testing-library/jest-dom';

const mockMember: Member = {
    id: '12345',
    username: 'Wystraplayer',
    displayName: 'Wystra',
    avatarUrl: 'https://example.com/avatar.png',
    status: 'online',
    roles: [],
    level: 5,
    levelProgress: 50,
    joinedAt: '25/06/2026',
    isBooster: false

};
describe('MemberRow Component', () => {
    beforeEach(() => {
        vi.stubGlobal('alert', vi.fn());
        vi.stubGlobal('navigator', {clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

    });
    
    it('Should display member details and copy ID to clipboard on click', () =>{
        render(<table><tbody><MemberRow member={mockMember}/></tbody></table>);

        expect(screen.getByText('Wystraplayer')).toBeInTheDocument();

        const idContainer = screen.getByText('12345');
        fireEvent.click(idContainer);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('12345');
    });
});