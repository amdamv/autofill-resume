/**
 * Shared LaTeX preamble generator.
 * Builds the standard document preamble from template style settings,
 * so templates don't duplicate boilerplate.
 */

import type { ITemplate, TemplateStyles } from '../types';

export function generatePreamble(template: ITemplate): string {
  const s = template.styles;

  return String.raw`\documentclass[letterpaper,${s.fontSize}]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[english]{babel}
\usepackage[letterpaper,margin=0.55in]{geometry}
\usepackage{latexsym}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage{fontawesome5}
\usepackage{microtype}
\setlength{\columnsep}{-1pt}
\IfFileExists{glyphtounicode.tex}{\input{glyphtounicode}}{}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\setlength{\parskip}{0pt}
\sloppy
\emergencystretch=2em

\titleformat{\section}{
  \vspace{${s.sectionSpacing}}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small#2} \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\newcommand{\resumeProjectHeading}[2]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small#2} \\
    \end{tabular*}\vspace{-7pt}
}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}
`;
}

export const DEFAULT_TEMPLATE_STYLES: TemplateStyles = {
  fontSize: '11pt',
  topMargin: '-0.65in',
  textHeight: '1.25in',
  sectionSpacing: '-4pt',
};
