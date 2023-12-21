export type HeaderProps = {
  badges?: Record<
    string,
    Record<
      string,
      {
        label?: string
        color?: string
        url?: string
      }
    >
  >
  metadata?: {
    key: string
    label?: string
    parse?: (value: any) => string
  }[]
}
