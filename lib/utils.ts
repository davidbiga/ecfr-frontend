import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CfrReference } from '../app/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateECFRUrl = (ref: CfrReference) => {
  const parts = ['https://www.ecfr.gov/current']
  
  if (ref.hierarchy.title) {
    parts.push(`title-${ref.hierarchy.title}`)
  }
  
  if (ref.hierarchy.chapter) {
    parts.push(`chapter-${ref.hierarchy.chapter}`)
  }
  
  if (ref.hierarchy.subchapter) {
    parts.push(`subchapter-${ref.hierarchy.subchapter}`)
  }
  
  if (ref.hierarchy.part) {
    parts.push(`part-${ref.hierarchy.part}`)
  }
  
  if (ref.hierarchy.subpart) {
    parts.push(`subpart-${ref.hierarchy.subpart}`)
  }
  
  if (ref.hierarchy.section) {
    parts.push(`section-${ref.hierarchy.section}`)
  }
  
  return parts.join('/')
}
