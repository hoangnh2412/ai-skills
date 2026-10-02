// Đích: src/features/{feature}/components/{Feature}Form/{Feature}Form.tsx
// Chỉ trường nhập: nhận register/control/errors từ page hoặc dialog — KHÔNG submit, KHÔNG gọi API.
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { FieldSelect, InputText, Label, Message, Textarea } from '@platform/core'
import { get{Feature}Messages, type {Feature}Locale } from '../../localization'
import { {FEATURE}_STATUS_OPTIONS } from '../../types'
import type { {Feature}FormData } from '../../validation'
import {
  fieldInputClass,
  fieldInputInvalidClass,
  fieldLabelClass,
  fieldTextareaClass,
  fieldTextareaInvalidClass,
} from '../fieldStyles'

export type {Feature}FormProps = {
  register: UseFormRegister<{Feature}FormData>
  control: Control<{Feature}FormData>
  errors: FieldErrors<{Feature}FormData>
  locale?: {Feature}Locale
  /** Ẩn trạng thái — vd. khi sửa, đổi trạng thái là thao tác riêng */
  hideStatus?: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <Message.Root severity="error" className="mt-1.5 border-0 bg-transparent p-0">
      <Message.Content>
        <Message.Text className="text-sm text-red-600">{message}</Message.Text>
      </Message.Content>
    </Message.Root>
  )
}

export function {Feature}Form({
  register,
  control,
  errors,
  locale = 'vi',
  hideStatus = false,
}: {Feature}FormProps) {
  const messages = get{Feature}Messages(locale)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="{feature}-code" className={fieldLabelClass}>
          {messages.fields.code} <span className="text-red-500">*</span>
        </Label>
        <InputText
          id="{feature}-code"
          unstyled
          placeholder={messages.placeholders.code}
          className={errors.code ? fieldInputInvalidClass : fieldInputClass}
          {...register('code')}
        />
        <FieldError message={errors.code?.message} />
      </div>

      <div>
        <Label htmlFor="{feature}-name" className={fieldLabelClass}>
          {messages.fields.name} <span className="text-red-500">*</span>
        </Label>
        <InputText
          id="{feature}-name"
          unstyled
          placeholder={messages.placeholders.name}
          className={errors.name ? fieldInputInvalidClass : fieldInputClass}
          {...register('name')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="{feature}-description" className={fieldLabelClass}>
          {messages.fields.description}
        </Label>
        <Textarea
          id="{feature}-description"
          rows={3}
          placeholder={messages.placeholders.description}
          className={errors.description ? fieldTextareaInvalidClass : fieldTextareaClass}
          {...register('description', {
            // ô trống → null (backend nhận null, không nhận chuỗi rỗng)
            setValueAs: (value: string | null) => (value?.trim() ? value.trim() : null),
          })}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {!hideStatus && (
        <div>
          <Label htmlFor="{feature}-status" className={fieldLabelClass}>
            {messages.fields.status}
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FieldSelect
                id="{feature}-status"
                value={field.value}
                options={{FEATURE}_STATUS_OPTIONS}
                onChange={field.onChange}
                placeholder={messages.placeholders.status}
                invalid={Boolean(errors.status)}
              />
            )}
          />
          <FieldError message={errors.status?.message} />
        </div>
      )}
    </div>
  )
}
