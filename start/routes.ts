import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'


Route.get('/home', async () => {})


Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  // Lookup user manually
  const user = await User
    .query()
    .where('email', email)
    .firstOrFail()

  // Verify password
  if (!(await Hash.verify(user.password, password))) {
    return response.badRequest('Senha incorreta!!')
  }

  // Create session
  await auth.use('api').login(user)
  return 'Olá '+auth.user.nome
})

Route.resource('users', 'UsersController')
