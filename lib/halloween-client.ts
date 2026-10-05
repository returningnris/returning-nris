'use client'

export async function halloweenRequest<T>(body: Record<string, unknown>, accessToken?: string): Promise<T> {
  const response = await fetch('/api/halloween', {
    method: 'POST', headers: { 'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: JSON.stringify(body), cache: 'no-store', referrerPolicy: 'no-referrer',
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Please try again.')
  return data as T
}

export async function copyEventText(value: string) {
  try { await navigator.clipboard.writeText(value) }
  catch {
    const input = document.createElement('textarea')
    input.value = value
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.focus(); input.select(); input.setSelectionRange(0, value.length)
    const copied = document.execCommand('copy')
    input.remove()
    if (!copied) throw new Error('Copy is unavailable. Press and hold the text to copy it.')
  }
}
