// src/app/auth-wrapper.js
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Loader from '@/lib/Loader'
import { checkUserAuth, logout } from '@/service/auth.service'
import userStore from '@/store/userStore'
import Header from './components/Header'

export default function AuthWrapper({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setUser, clearUser } = userStore()

  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  // pages that anyone can hit
  const publicRoutes = ['/user-login', '/ForgetPassword', '/Resetpassword']
  const isPublicPage = publicRoutes.includes(pathname)

  useEffect(() => {
    // if they’re _not_ on a public page and have no token → redirect:
    const token = localStorage.getItem('token')
    if (!isPublicPage && !token) {
      router.replace('/user-login')
      return
    }

    // if they're on login but _do_ have a token → bounce home:
    if (isPublicPage && token) {
      router.replace('/')
      return
    }

    // if it's a protected page and they _do_ have a token, verify it:
    if (!isPublicPage && token) {
      checkUserAuth()
        .then(res => {
          if (res.isAuthenticated) {
            setUser(res.user)
            setAuthed(true)
          } else {
            throw new Error()
          }
        })
        .catch(async () => {
          clearUser()
          await logout()
          router.replace('/user-login')
        })
        .finally(() => setLoading(false))
      return
    }

    // public page with no token — just show it
    setLoading(false)
  }, [pathname, router, setUser, clearUser, isPublicPage])

  // show loader while redirecting or verifying
  if (loading) return <Loader />

  // at this point, either:
  // • on a public page, or
  // • authenticated and on any page
  return (
    <>
      {!isPublicPage && authed && <Header />}
      {children}
    </>
  )
}
