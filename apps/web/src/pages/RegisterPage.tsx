import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { registerFormSchema } from '../validation/auth.schemas';
import type { RegisterFormValues } from '../types/auth.types';
import { registerRequest } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { getApiErrorMessage } from '../utils/api-error';
import { FormField } from '../components/FormField';
import { Button } from '../components/ui/Button';

export function RegisterPage(): JSX.Element {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (tokens) => {
      setSession(tokens);
      navigate('/dashboard', { replace: true });
    },
  });

  const onSubmit = handleSubmit((values) => registerMutation.mutate(values));

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">إنشاء حساب</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField id="fullName" type="text" label="الاسم الكامل" error={errors.fullName} {...register('fullName')} />
        <FormField id="email" type="email" label="البريد الإلكتروني" error={errors.email} {...register('email')} />
        <FormField id="password" type="password" label="كلمة المرور" error={errors.password} {...register('password')} />

        {registerMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">{getApiErrorMessage(registerMutation.error)}</p>
        )}

        <Button type="submit" disabled={registerMutation.isPending} className="w-full">
          {registerMutation.isPending ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        عندك حساب بالفعل؟{' '}
        <Link to="/login" className="font-medium text-accent-600 hover:underline dark:text-accent-400">
          سجّل الدخول
        </Link>
      </p>
    </>
  );
}
