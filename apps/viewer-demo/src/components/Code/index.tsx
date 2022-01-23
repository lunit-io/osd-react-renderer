import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import Prism from 'prismjs'
import Image from 'next/image'

interface CodeProps {
  source: string
  fullSource: string
  codesandboxUrl: string
}

export default function Code({
  codesandboxUrl,
  source,
  fullSource,
}: CodeProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [expanded])

  const handleSourceToggleClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        width: 0,
        maxWidth: 700,
        background: theme => theme.palette.darkGrey[100],
        padding: 3,
      }}
    >
      <IconButton onClick={handleSourceToggleClick}>
        <Image src="/code-black.svg" alt="Code" width="24" height="24" />
      </IconButton>
      <Button
        variant="contained"
        sx={{ padding: '0 4px' }}
        href={codesandboxUrl}
        target="_blank"
        rel="noopener"
      >
        CODESANDBOX
      </Button>
      <pre style={{ marginTop: 16 }}>
        <code className="language-javascript">
          {expanded ? fullSource : source}
        </code>
      </pre>
    </Box>
  )
}
