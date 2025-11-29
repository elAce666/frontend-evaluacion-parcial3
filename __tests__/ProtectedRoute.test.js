import { render, screen } from '@testing-library/react';

// Mock de react-router-dom para evitar comportamientos internos ESM
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

// Mock controlable del AuthContext
const mockUseAuth = jest.fn();
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const ProtectedRoute = require('../src/components/ProtectedRoute').default;
// No se requiere wrapper porque MemoryRouter está mockeado

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  test('renderiza contenido cuando autenticado', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
    render(<ProtectedRoute><div>Privado</div></ProtectedRoute>);
    expect(screen.getByText('Privado')).toBeInTheDocument();
  });

  test('redirige cuando no autenticado (no muestra contenido)', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    render(<ProtectedRoute><div>No debe verse</div></ProtectedRoute>);
    expect(screen.queryByText('No debe verse')).toBeNull();
  });
});