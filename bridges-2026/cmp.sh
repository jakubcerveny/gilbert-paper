#!/bin/bash

PAPER=Gilbert

rm -f *.log *.aux *.abs *.log *.out *.xmpdata *.xmpi *.bbl *.blg
pdflatex $PAPER.tex
bibtex $PAPER
pdflatex $PAPER.tex
pdflatex $PAPER.tex

