import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

const mockUseAuth = jest.fn();
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../src/utils/roleValidator', () => ({
  hasAnyRole: (role, allowed) => allowed.includes(role),
  getDefaultRoute: () => '/',
}));

const RoleGuard = require('../src/components/RoleGuard').default;
// Wrapper innecesario por mock

describe('RoleGuard', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  test('muestra contenido si rol permitido', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false, user: { role: 'ADMIN' } });
    render(<RoleGuard allowedRoles={['ADMIN']}> <div>Permitido</div> </RoleGuard>);
    expect(screen.getByText('Permitido')).toBeInTheDocument();
  });

  test('bloquea contenido si rol no permitido', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false, user: { role: 'CLIENTE' } });
    render(<RoleGuard allowedRoles={['ADMIN']}><div>Secreto</div></RoleGuard>);
    expect(screen.queryByText('Secreto')).toBeNull();
  });
});