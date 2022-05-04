import { AuthProvider, SocialLoginType } from '@arcana/auth'
import { Wallet } from 'ethers'
import { useStore } from 'vuex'

import padPublicKey from '../utils/padPublicKey'

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK
const ARCANA_AUTH_FLOW = import.meta.env.VITE_ARCANA_AUTH_FLOW

let authInstance = null

function useArcanaAuth() {
  const store = useStore()

  async function init() {
    if (!authInstance) {
      authInstance = await AuthProvider.init({
        appId: ARCANA_APP_ID,
        network: ARCANA_AUTH_NETWORK,
        flow: ARCANA_AUTH_FLOW,
        redirectUri: `${window.location.origin}/auth/redirect`,
      })
    }
  }

  function isLoggedIn() {
    return authInstance.isLoggedIn()
  }

  async function login() {
    if (!isLoggedIn()) {
      await authInstance.loginWithSocial(SocialLoginType.google)
    }
  }

  async function fetchUserDetails() {
    store.dispatch(
      'showLoader',
      'Fetching keys and generating wallet address...'
    )

    const { userInfo, privateKey } = authInstance.getUserInfo()
    store.dispatch('addBasicDetails', {
      email: userInfo.id,
      profileImage: userInfo.picture,
      givenName: userInfo.name,
    })

    const publicKey = await authInstance.getPublicKey({
      verifier: 'google',
      id: userInfo.id,
    })
    const actualPublicKey = padPublicKey(publicKey)
    const wallet = new Wallet(privateKey)
    store.dispatch('addCryptoDetails', {
      walletAddress: wallet.address,
      privateKey: privateKey,
      publicKey: actualPublicKey,
    })

    store.dispatch('hideLoader')
  }

  function handleRedirect() {
    AuthProvider.handleRedirectPage(window.location)
  }

  async function logout() {
    await authInstance.logout()
    store.dispatch('clearStore')
  }

  async function getPublicKey(email) {
    return await authInstance.getPublicKey({
      verifier: SocialLoginType.google,
      id: email,
    })
  }

  return {
    init,
    handleRedirect,
    isLoggedIn,
    login,
    logout,
    fetchUserDetails,
    getPublicKey,
  }
}

export default useArcanaAuth
