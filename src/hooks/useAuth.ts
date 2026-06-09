const KEY = 'isAdmin'

export function useAuth() {
  const isAdmin = localStorage.getItem(KEY) === 'true'

  function login() {
    localStorage.setItem(KEY, 'true')
  }

  function logout() {
    localStorage.removeItem(KEY)
  }

  return { isAdmin, login, logout }
}
