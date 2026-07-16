import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginFormSchema } from '../validation/auth.schemas';
import type { LoginFormValues } from '../types/auth.types';
import { loginRequest } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { getApiErrorMessage } from '../utils/api-error';
import { FormField } from '../components/FormField';
import { Button } from '../components/ui/Button';

export function LoginPage(): JSX.Element {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (tokens) => {
      setSession(tokens);
      navigate(redirectTo, { replace: true });
    },
  });

  const onSubmit = handleSubmit((values) => loginMutation.mutate(values));

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">تسجيل الدخول</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField id="email" type="email" label="البريد الإلكتروني" error={errors.email} {...register('email')} />
        <FormField id="password" type="password" label="كلمة المرور" error={errors.password} {...register('password')} />

        {loginMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">{getApiErrorMessage(loginMutation.error)}</p>
        )}

        <Button type="submit" disabled={loginMutation.isPending} className="w-full">
          {loginMutation.isPending ? 'جارٍ الدخول...' : 'دخول'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        مفيش حساب؟{' '}
        <Link to="/register" className="font-medium text-accent-600 hover:underline dark:text-accent-400">
          سجّل الآن
        </Link>
      </p>
    </>
  );
}
