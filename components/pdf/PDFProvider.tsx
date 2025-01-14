'use client'

import { type MutableRefObject, createContext } from 'react'
import { type Options, usePDF } from 'react-to-pdf'

interface PDFContextInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetRef: MutableRefObject<any>
  toPDF: (options?: Options | undefined) => void
}

// @ts-expect-error HELPMI
export const PDFContext = createContext<PDFContextInterface>(null)

export function PDFProvider({
  documentTitle,
  children,
}: {
  children: React.ReactNode
  documentTitle: string
}) {
  const { targetRef, toPDF } = usePDF({
    filename: `${documentTitle}.pdf`,
    page: {
      margin: 15,
    },
  })

  return (
    <PDFContext.Provider value={{ targetRef, toPDF }}>
      {children}
    </PDFContext.Provider>
  )
}
