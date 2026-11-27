import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Guards navigation while a form has unsaved changes.
 * - In-app links call `navigate(href)`; when dirty, a ConfirmModal is opened via `modal`.
 * - Closing/reloading the tab triggers the browser's own "leave site?" prompt.
 */
export function useUnsavedChangesGuard(dirty: boolean) {
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const leaving = useRef(false)

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (leaving.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const navigate = useCallback(
    (href: string) => {
      if (dirty) setPendingHref(href)
      else window.location.href = href
    },
    [dirty]
  )

  /** Navigates without asking (e.g. right after a successful save). */
  const leave = useCallback((href: string) => {
    leaving.current = true
    window.location.href = href
  }, [])

  const cancel = useCallback(() => setPendingHref(null), [])
  const confirm = useCallback(() => {
    if (pendingHref) leave(pendingHref)
    setPendingHref(null)
  }, [pendingHref, leave])

  return {
    navigate,
    leave,
    /** Props for <ConfirmModal> */
    modal: {
      open: pendingHref !== null,
      title: 'Sair sem salvar?',
      message: 'Você tem alterações nesta vaga que ainda não foram salvas. Se sair agora, elas serão perdidas.',
      confirmLabel: 'Sair sem salvar',
      cancelLabel: 'Continuar editando',
      tone: 'danger' as const,
      onConfirm: confirm,
      onCancel: cancel
    }
  }
}
