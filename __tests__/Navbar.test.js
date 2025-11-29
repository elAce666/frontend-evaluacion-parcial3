import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
}));

const mockUseAuth = jest.fn();
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../src/utils/roleValidator', () => ({
  getMenuItems: () => ([
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Productos', icon: '🧴' },
  ]),
  getRoleDisplayName: () => 'Administrador',
}));

const Navbar = require('../src/components/Navbar').default;
// Wrapper innecesario por mock

describe('Navbar', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  test('muestra elementos de menú y datos de usuario', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'ADMIN', name: 'Administrador' }, logout: jest.fn() });
    render(<Navbar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getAllByText('Administrador').length).toBeGreaterThan(0);
  });

  test('no renderiza si no autenticado', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navbar />);
    expect(screen.queryByText('Dashboard')).toBeNull();
  });
});