import { useEffect, useRef, useState } from 'react'
import { Avatar } from '../atoms/Avatar'
import { Button } from '../atoms/Button'
import { Alerta } from '../molecules/Alerta'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { squarePhoto } from '../../utils/image'
import { profileApi } from '../../services/profileApi'

type PhotoEditorProps = {
  name: string
  currentUrl: string | null
  onSaved: (photoUrl: string) => void
  onRemoved: () => void
  onCancel: () => void
}

export function PhotoEditor({ name, currentUrl, onSaved, onRemoved, onCancel }: PhotoEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url) }, [preview])

  const choose = async (file?: File) => {
    if (!file) return
    setError(null)
    try {
      const blob = await squarePhoto(file)
      setPreview({ blob, url: URL.createObjectURL(blob) })
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const save = async () => {
    if (!preview) return
    setBusy(true)
    setError(null)
    try {
      onSaved((await profileApi.uploadPhoto(preview.blob)).photo_url)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setConfirmRemove(false)
    setBusy(true)
    try {
      await profileApi.deletePhoto()
      onRemoved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && <Alerta tipo="erro">{error}</Alerta>}
      <div className="flex flex-col items-center gap-6 rounded-3xl border-2 border-slate-200 bg-white p-8">
        <Avatar src={preview?.url ?? currentUrl} name={name} size="xl" />
        <p className="text-xl text-slate-700 text-center">
          {preview ? 'Assim vai ficar sua foto. Gostou? Toque em Salvar.' : 'Use uma foto do rosto, com boa luz. Ela aparece para as empresas.'}
        </p>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" id="photo-input"
          onChange={e => { choose(e.target.files?.[0]); e.target.value = '' }} />
        <div className="flex w-full flex-col gap-3 md:flex-row md:justify-center">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
            {preview || currentUrl ? 'Escolher outra foto' : 'Escolher foto'}
          </Button>
          {currentUrl && !preview && (
            <Button type="button" variant="secondary" onClick={() => setConfirmRemove(true)} disabled={busy}>Remover foto</Button>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button type="button" variant="primary" onClick={save} disabled={!preview || busy}>{busy ? 'Enviando...' : 'Salvar'}</Button>
      </div>
      <ConfirmModal open={confirmRemove} tone="danger" title="Remover sua foto?" message="Seu perfil vai mostrar suas iniciais no lugar da foto."
        confirmLabel="Sim, remover" cancelLabel="Não, manter" onConfirm={remove} onCancel={() => setConfirmRemove(false)} />
    </div>
  )
}
