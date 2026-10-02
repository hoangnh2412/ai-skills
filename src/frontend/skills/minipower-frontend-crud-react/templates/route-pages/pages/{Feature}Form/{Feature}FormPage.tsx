// Đích: src/features/{feature}/pages/{Feature}Form/{Feature}FormPage.tsx — một page cho cả tạo và sửa (mode).
// Sửa: host truyền {feature}Id (wrapper useParams); không truyền defaultValues ⇒ page tự nạp bản ghi.
import { useEffect, useState, type FormEventHandler, type ReactNode } from 'react'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Card, Loading, getErrorMessage, handleAction, notify, type ActionProps } from '@platform/core'
import { {Feature}Form } from '../../components/{Feature}Form'
import { {Feature}PageShell } from '../../components/{Feature}PageShell'
import { use{Feature}Form } from '../../hooks'
import { get{Feature}Messages, type {Feature}Locale } from '../../localization'
import { get{Feature}ListPath, navigate{Feature} } from '../../routes'
import { callCreate{Feature}, callGet{Feature}, callUpdate{Feature} } from '../../services'
import { resolve{Feature}Content, type {Feature}SlotContent } from '../../utils'
import { unwrap{Feature} } from '../../utils/apiData'
import {
  {feature}FormDefaultValues,
  to{Feature}FormValues,
  type {Feature}FormData,
} from '../../validation'

type FormMode = 'create' | 'edit'

export type {Feature}FormPageContentContext = {
  mode: FormMode
  {feature}Id?: string
  register: UseFormRegister<{Feature}FormData>
  control: Control<{Feature}FormData>
  errors: FieldErrors<{Feature}FormData>
  isSubmitting: boolean
  /** Gắn vào <form onSubmit> — đã validate + toast. withShell={false} thì host tự bọc <form>. */
  submit: FormEventHandler<HTMLFormElement>
  onCancel?: () => void
  DefaultContent: ReactNode
}

export type {Feature}FormPageProps = {
  mode?: FormMode
  /** Bắt buộc khi mode="edit" */
  {feature}Id?: string
  /** Giá trị ban đầu — truyền tham chiếu ỔN ĐỊNH (state / useMemo): đổi tham chiếu là form bị reset */
  defaultValues?: Partial<{Feature}FormData>
  onCancel?: () => void
  /** `false` = không tự về danh sách khi hủy / sau khi lưu @default true */
  useRoutes?: boolean
  locale?: {Feature}Locale
  title?: string
  description?: string
  submitLabel?: string
  className?: string
  hideStatus?: boolean
  /** `callback.onSubmit` thay API tạo / sửa mặc định */
  callback?: ActionProps<{ data: {Feature}FormData; mode: FormMode }, {Feature}FormData>
  content?: {Feature}SlotContent<{Feature}FormPageContentContext>
  /** @default true */
  withShell?: boolean
}

export function {Feature}FormPage({
  mode = 'create',
  {feature}Id,
  defaultValues,
  onCancel,
  useRoutes = true,
  locale = 'vi',
  title,
  description,
  submitLabel,
  className,
  hideStatus,
  callback,
  content,
  withShell = true,
}: {Feature}FormPageProps) {
  const messages = get{Feature}Messages(locale)
  const isEdit = mode === 'edit'
  const shouldLoad = isEdit && Boolean({feature}Id) && defaultValues === undefined

  const [loadedValues, setLoadedValues] = useState<{Feature}FormData | null>(null)
  const [loadingItem, setLoadingItem] = useState(shouldLoad)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = use{Feature}Form({ defaultValues })

  // Sửa mà host không truyền defaultValues ⇒ tự nạp bản ghi
  useEffect(() => {
    if (!shouldLoad || !{feature}Id) return
    let cancelled = false
    callGet{Feature}({feature}Id)
      .then((res) => {
        if (!cancelled) setLoadedValues(to{Feature}FormValues(unwrap{Feature}(res)))
      })
      .catch((error: unknown) => {
        if (!cancelled) notify.error(getErrorMessage(error, messages.form.loadError))
      })
      .finally(() => {
        if (!cancelled) setLoadingItem(false)
      })
    return () => {
      cancelled = true
    }
  }, [shouldLoad, {feature}Id, messages])

  const initialValues = defaultValues ?? loadedValues
  useEffect(() => {
    if (initialValues) reset({ ...{feature}FormDefaultValues, ...initialValues })
  }, [initialValues, reset])

  const goList = useRoutes ? () => navigate{Feature}(get{Feature}ListPath()) : undefined
  const handleCancel = onCancel ?? goList

  const defaultSubmit = async (data: {Feature}FormData) => {
    if (isEdit) {
      if (!{feature}Id) throw new Error('Thiếu {feature}Id khi cập nhật')
      // map form → payload tường minh: sửa KHÔNG gửi status (đổi trạng thái là thao tác riêng)
      await callUpdate{Feature}({feature}Id, {
        code: data.code,
        name: data.name,
        description: data.description ?? null,
      })
      return
    }
    await callCreate{Feature}({
      code: data.code,
      name: data.name,
      description: data.description ?? null,
      status: data.status,
    })
  }

  const submit = handleSubmit(async (data) => {
    try {
      const outcome = await handleAction({
        ctx: { data, mode },
        callback,
        defaultSubmit,
        getPayload: ({ data: payload }) => payload,
        onSuccess: () => goList?.(),
      })
      if (outcome.status === 'cancelled') return
      notify.success(isEdit ? messages.form.updateSuccess : messages.form.saveSuccess)
    } catch (error) {
      notify.error(getErrorMessage(error, messages.form.saveError))
    }
  })

  const fields = loadingItem ? (
    <Loading label={messages.form.loading} />
  ) : (
    <Card.Root className="w-full overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <Card.Body className="p-5 sm:p-6">
        <{Feature}Form
          register={register}
          control={control}
          errors={errors}
          locale={locale}
          hideStatus={hideStatus ?? isEdit}
        />
      </Card.Body>
    </Card.Root>
  )

  const ctx: {Feature}FormPageContentContext = {
    mode,
    {feature}Id,
    register,
    control,
    errors,
    isSubmitting,
    submit,
    onCancel: handleCancel,
    DefaultContent: fields,
  }

  const resolved = resolve{Feature}Content(content, ctx, fields)

  if (!withShell) return <>{resolved}</>

  return (
    <{Feature}PageShell
      asForm
      title={title ?? (isEdit ? messages.form.editTitle : messages.form.createTitle)}
      description={description ?? (isEdit ? messages.form.editDescription : messages.form.createDescription)}
      submitLabel={submitLabel ?? (isEdit ? messages.form.editSubmit : messages.form.createSubmit)}
      cancelLabel={messages.form.cancel}
      submittingLabel={messages.form.submitting}
      isSubmitting={isSubmitting}
      onSubmit={submit}
      onCancel={handleCancel}
      className={className}
    >
      {resolved}
    </{Feature}PageShell>
  )
}
