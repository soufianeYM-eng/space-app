import api from '@/api'

export class AuthService {
  static getAccountDetails = async () => {
    const response = await api.get('/my/account')
    return response.data.data.account
  }
}
