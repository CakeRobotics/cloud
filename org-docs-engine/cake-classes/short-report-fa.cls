\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{short-report-fa}[2021/05/11 Farsi Short Article]
\LoadClass[a4paper, 12pt]{article}

\usepackage{xcolor}
\usepackage{fancyvrb}
\usepackage{listings}

\usepackage{lastpage}
\usepackage{array} % for table \raggedright stuff

\usepackage[pagebackref=false,colorlinks,linkcolor=blue,citecolor=blue]{hyperref}
\usepackage[top=30mm, bottom=35mm, left=25mm, right=25mm]{geometry}
\usepackage{fancyhdr, graphicx}
\usepackage{fancyvrb}
\usepackage[extrafootnotefeatures, localise]{xepersian}
\settextfont[Scale=1]{XB Niloofar}
\setlatintextfont[Scale=0.9]{Tahoma}
\linespread{1.6}
\newcommand{\مل}{\متن‌لاتین}
\usepackage{comment}
\usepackage{titling}
\pagestyle{fancy}
\usepackage{parskip}
%\fancyhead[L]{\includegraphics[width=3cm]{logo-h-nosub-dark.png}}
\fancyhead[L]{\lr{\Verb!CAKE-DOC-\id!}}
\fancyhead[R]{\it{\thetitle}}
\setlength{\headheight}{27pt}


%\input{title-patch.tex}
\IfFileExists{title-patch.tex}{\input{title-patch.tex}}{\input{cake-classes/title-patch-default.tex}}

\newcommand{\درج‌عنوان‌سند}{
	\vspace*{-2cm}
	
	\centerline{به نام خدا}
	
	\vspace{-.8cm}
	
	\hfill \includegraphics[width=4cm]{cake-classes/idas-h.png}

	\hfill \includegraphics[width=3cm]{cake-classes/logo-h-nosub-dark.png}

	\vspace{2cm}
	\centerline{\huge \thetitle}
	\vspace{1cm}
	\thispagestyle{plain}
	\vspace{1cm}
	\begin{center}
	\begin{tabular}{|p{5cm}p{7cm}|}
	\hline
	کد سند: \Verb!\id! & نویسنده اصلی: \theauthor \\
	نسخه: \version & سایر نویسندگان: \otherauthors \\
	تاریخ: \thedate & دامنه انتشار سند: \scope \\
	تعداد صفحات: \pageref*{LastPage} & برچسب‌ها: \labels \\
	هش: \Verb!\hash! & \\
	\hline
	\end{tabular}
	\end{center}
	\vspace{1cm}

%	فهرست نسخه‌ها:
	
%	{
%	\setlength{\parindent}{2cm}
%	\changelog
%	}

	\begin{center}
	\begin{tabular}{|%
		>{\centering\arraybackslash}p{1cm}%
		>{\centering\arraybackslash}p{2cm}%
		>{\centering\arraybackslash}p{3cm}%
		>{\raggedleft\arraybackslash}p{5.2cm}%
	|}
	\hline
	نسخه & تاریخ & نویسنده & شرح تغییرات \\
	\hline
	\changelog
	\hline
	\end{tabular}
	\end{center}

	\newpage
	\vspace*{3cm}
}

\newcommand{\درج‌مراجع}[1]{
\section*{مراجع}
\pagestyle{empty}
{
\begingroup
\renewcommand{\section}[2]{}%
\begin{flushleft}
\begin{latin}
\bibliographystyle{vancouver}
#1
\end{latin}
\end{flushleft}
\endgroup
}
}


\def\labelitemi{--}



\lstdefinestyle{python}%
{%
    basicstyle          = \footnotesize\ttfamily,
    language            = Python,
    numbers             = left,
    numberstyle         = \ttfamily\color{gray},
    stepnumber          = 1,
    numbersep           = 8pt,
    backgroundcolor     = \color{white},
    showspaces          = false,
    showstringspaces    = false,
    showtabs            = false,
    frame               = single,
    tabsize             = 4,
    captionpos          = b,
    breaklines          = true,
    breakatwhitespace   = false,
    morestring          = [b]",
    stringstyle         = \color{magenta!90!black},
    keywordstyle        = \color{blue},
    commentstyle        = \color{gray},
    identifierstyle     = \color{black},
    moredelim           = **[is][\bfseries]{`}{`},
    fancyvrb            = true,
    xleftmargin         = 1cm,
    xrightmargin        = 1cm,
    morekeywords        = {async},
}

\lstnewenvironment{python}{%
  \vspace{0.3cm}
  \latin
  \linespread{1}
  \lstset{style=python}
}{}

\newcommand{\pythonfromfile}[1]{{
  \vspace{0.3cm}
  \latin
  \linespread{1}
  \lstset{style=python}
  \lstinputlisting{#1}
}}

