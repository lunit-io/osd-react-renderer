import dynamic from 'next/dynamic'

const OSDViewer = dynamic(() => import('@lunit/osd-react-renderer'), {
  ssr: false,
})

export default OSDViewer

export const ScalebarLocation = dynamic(
  () =>
    import('@lunit/osd-react-renderer').then(module => module.ScalebarLocation),
  {
    ssr: false,
  }
)
