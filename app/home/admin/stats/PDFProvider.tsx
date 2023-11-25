'use client'

import { type MutableRefObject, createContext } from 'react'
import { type Options, usePDF } from 'react-to-pdf'

interface PDFContextInterface {
  targetRef: MutableRefObject<HTMLElement>
  toPDF: (options?: Options | undefined) => void
}

// @ts-expect-error HELPMI
export const PDFContext = createContext<PDFContextInterface>(null)

export function PDFProvider({ children }: { children: React.ReactNode }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'Estadísticas del sistema.pdf',
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
