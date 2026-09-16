import dynamic from 'next/dynamic'

export const revalidate = 0

const ClientPage = dynamic(() => import('./ClientPage'), { ssr: false })

export default function Page() {
  return <ClientPage />
}
