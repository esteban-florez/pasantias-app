import { object, string, type z } from 'zod'
import messages from '../messages'

export type Fields = z.infer<typeof schema>

export const schema = object({
  title: string(messages.string)
    .min(5, messages.min(5))
    .max(100, messages.max(100)),
  description: string(messages.string)
    .min(15, messages.min(15))
    .max(255, messages.max(255)),
})