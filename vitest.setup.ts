import '@testing-library/jest-dom'

// jsdom doesn't implement Web Speech API — provide minimal stubs
global.SpeechSynthesisUtterance = class {
  text: string = ''
  lang: string = ''
  rate: number = 1
  pitch: number = 1
  voice: any = null
  constructor(text?: string) {
    this.text = text ?? ''
  }
} as any
