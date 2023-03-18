import Route from '@ioc:Adonis/Core/Route'

Route.get('/hello', async () => {})

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    const token = await auth.use('api').attempt(email, password)
    return token
  } catch {
    return response.unauthorized('Credenciais Invalidas')
  }
})

Route.get('dashboard', async ({ auth }) => {
  await auth.use('api').authenticate()
  return 'Ola '+auth.user.nome+', você está autenticado(a)!'
})

Route.resource('users', 'UsersController')
