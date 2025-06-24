'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'bhc-onboarding-completed'

export function useFirstLoginStatus() {
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY)
    if (!hasCompletedOnboarding) {
      setIsFirstLogin(true)
    }
  }, [])

  const markOnboardingAsCompleted = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsFirstLogin(false)
  }

  return { isFirstLogin, markOnboardingAsCompleted }
}
