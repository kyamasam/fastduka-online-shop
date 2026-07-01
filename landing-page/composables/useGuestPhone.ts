export const useGuestPhone = () =>
  useCookie<{ phone_code: string; phone_number: string }>('guestPhone', {
    default: () => ({ phone_code: '+254', phone_number: '' }),
  })
