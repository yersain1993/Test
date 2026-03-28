import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import RegisterCard from './RegisterCard';

const registerUserMock = vi.fn();

vi.mock('@/features/auth/services/registerService', () => ({
  registerUser: (...args: unknown[]) => registerUserMock(...args),
}));

const renderRegisterCard = (onSuccess?: () => void) =>
  render(
    <MemoryRouter>
      <RegisterCard onSuccess={onSuccess} />
    </MemoryRouter>
  );

describe('RegisterCard', () => {
  it('toggles password and confirm password visibility', async () => {
    const user = userEvent.setup();
    renderRegisterCard();

    const passwordInput = screen.getByPlaceholderText('Tu contrasena');
    const confirmInput = screen.getByPlaceholderText('Repite tu contrasena');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    await user.click(
      screen.getByRole('button', { name: 'Mostrar contrasena' })
    );
    await user.click(
      screen.getByRole('button', {
        name: 'Mostrar confirmacion de contrasena',
      })
    );

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmInput).toHaveAttribute('type', 'text');
  });

  it('shows zod validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderRegisterCard();

    await user.type(screen.getByPlaceholderText('usuario@correo.com'), 'abc@abc');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repite tu contrasena'),
      '12345678'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('Ingresa un email valido')).toBeInTheDocument();
    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it('submits valid form with trimmed email', async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValueOnce({ ok: true, data: { message: 'ok' } });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const onSuccess = vi.fn();

    renderRegisterCard(onSuccess);

    await user.type(
      screen.getByPlaceholderText('usuario@correo.com'),
      '  user@example.com  '
    );
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repite tu contrasena'),
      '12345678'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: '12345678',
      });
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(
      'Cuenta creada exitosamente. Ahora puedes iniciar sesion.'
    );
    expect(screen.getByPlaceholderText('Tu contrasena')).toHaveValue('');
    expect(screen.getByPlaceholderText('Repite tu contrasena')).toHaveValue('');
  });

  it('shows specific message when user already exists', async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValueOnce({
      ok: false,
      reason: 'user_already_exists',
    });

    renderRegisterCard();

    await user.type(screen.getByPlaceholderText('usuario@correo.com'), 'a@a.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repite tu contrasena'),
      '12345678'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('Este usuario ya existe')).toBeInTheDocument();
  });

  it('shows generic validation message for backend validation_error', async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValueOnce({
      ok: false,
      reason: 'validation_error',
    });

    renderRegisterCard();

    await user.type(screen.getByPlaceholderText('usuario@correo.com'), 'a@a.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repite tu contrasena'),
      '12345678'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByText('Revisa los datos del formulario')
    ).toBeInTheDocument();
  });

  it('shows fallback message for unexpected register errors', async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValueOnce({ ok: false, reason: 'network_error' });

    renderRegisterCard();

    await user.type(screen.getByPlaceholderText('usuario@correo.com'), 'a@a.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '12345678');
    await user.type(
      screen.getByPlaceholderText('Repite tu contrasena'),
      '12345678'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('No se pudo crear la cuenta')).toBeInTheDocument();
  });
});
