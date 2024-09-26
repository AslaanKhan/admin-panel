import React from 'react'

type Props = {
    children: React.ReactNode
}

const BlurPage = ({ children }: Props) => {
  return (
    <div className="h-screen overflow-scroll backdrop-blur-[35px] bg-muted/60 dark:shadow-black  mx-auto p-4 absolute top-0 right-0 left-0 botton-0 z-[11]"
    id="blur-page">{children}</div>
  )
}

export default BlurPage