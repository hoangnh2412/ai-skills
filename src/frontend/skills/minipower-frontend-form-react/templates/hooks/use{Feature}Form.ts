// Đích: src/features/{feature}/hooks/use{Feature}Form.ts — react-hook-form + zodResolver, validate khi gõ.
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import {
  {feature}FormDefaultValues,
  {feature}FormSchema,
  type {Feature}FormData,
} from '../validation'

export type Use{Feature}FormOptions = {
  defaultValues?: Partial<{Feature}FormData>
}

export function use{Feature}Form(
  options: Use{Feature}FormOptions = {},
): UseFormReturn<{Feature}FormData> {
  return useForm<{Feature}FormData>({
    resolver: zodResolver({feature}FormSchema),
    mode: 'onChange',
    defaultValues: {
      ...{feature}FormDefaultValues,
      ...options.defaultValues,
    },
  })
}
