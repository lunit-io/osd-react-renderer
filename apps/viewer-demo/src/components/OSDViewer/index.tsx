import dynamic from 'next/dynamic'

export const OSDViewer = dynamic(() => import('@lunit/osd-react-renderer'), {
  ssr: false,
})
