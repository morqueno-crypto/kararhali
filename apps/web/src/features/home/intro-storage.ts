const KEY = 'karar:intro-seen'

/** Giriş animasyonu bu oturumda izlendi mi? (Depolama erişilemezse false.) */
export function hasSeenIntro() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // Gizli mod vb.: sessizce geç, animasyon bir sonraki ziyarette yine oynar.
  }
}
