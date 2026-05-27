import { transliterate } from './transliterate.util';

export function escape(value?: string): string {
  return transliterate(value || '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function safeUrl(value?: string): string {
  return (value || '').replace(/[{}\s]/g, '');
}

export function stripProtocol(value: string): string {
  return value.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
