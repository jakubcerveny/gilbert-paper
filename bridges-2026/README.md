Gilbert Paper for Bridges 2026
===

This sub-directory holds LaTeX files and the current compiled PDF version of
the Gilbert paper to be submitted to the [Bridges 2026 conference](https://www.bridgesmathart.org/b2026/).

Note that we have not submitted nor have any indication of whether this paper will be
accpted or not.

Bridges Constraints
----

### From *"LaTeX Template for Bridges Proceedings Paper"*:

* Abstract:
  - one paragraph
  - 3-8 lines of text (shorter preferred)
  - avoid footnotes, citations, special symbols, formatting
* Paper should present novel achievment, experiments, artwork and/or insight by authors
  - no toturials, blogs, wikipedia pages, etc.
* Regular papers:
  - 8 or 6 pages, including references
  - 7 pages **not** allowed (6 or 8 pages are even, used for page alignemnt)
  - no wasted whitespace
* Short pages:
  - 2 or 4 pages, including references
* paper should be submitted after experiments or novel analysis is done, with
  concrete results
* rejected papers:
  - numerology
  - ratios from artwork or architecture
* write for audience with general education
* skip lengthy background and previous work sections
  - give clear explanations on novel contributions with diagrams and/or images
* use the template provided (for LaTeX)
* article will be printed on 8.5in x 11in
* do not insert headers or footers
* use `bridges.sty` (LaTeX)
* paper sizes:
  - on the first page, distance from top edge of first line of title should be 3cm (1 + 3/16in)
    + even though on their template it's 3.5cm
  - second and subsequent pages top edge to fist line should be 2.5cm (1in)
  - width on margins left and right should be 2.5cm (1 in)
  - font is *Times New Roman*
  - body text 11pt 
  - section headings, authors and affilitations 12pt
  - title 16pt
  - abstract 9pt
  - don't engage in blood face yelling, using italics for emphasis
  - no indentation for first paragraph after section heading
  - subsequent paragraphs are indented
* Figures/Tables
  - follow the law (don't download a car)
  - images high quality and readable in color and grayscale
  - stay below 10mb
  - figures automatically number, text is automatically italicized
  - use subcaption?
  - all figures and tables must be referenced in text
  - no bleeding into margins
  - looks like periods at the end of figure text
* Sections/Subsections
  - important words capitalized while conjunctions and prepositions lower case
  - avoid punctuation, with the exception of a single colon or comma
  - do not end title or section heading with period
  - do not use numbered sections (unless referencing sections by numbers in text)
  - limit yourself to two levels of hierarchy
  - abstract, acknowledgements and references are unnumbered
  - use `\subsections*` for subsections
  - subsections are never numbered
  - subsection titles 11pt, left justified, bold, italicized
  - try to avoid last line of paragraph migrating to first line of new page
  - keep section title and (bulk of/beginning of) section on the same page
  - `\vsapce*` or `\pagebreak` to help formatting if necessary
* Wrap-up
  - conclude with brief section providing **Summary and Conclusions** (followed by acknowledgements)
  - acknowledgements are optional and follow summary/conclusions
  - references follow summary conclusions or acknowledgements if present
  - only provide refernces cited in paper
  - *references*:
    + listed alphabetically
    + last name of first author, numbered sequentially
    + see bridges guide to citations for more detail
    + bibtex not recommended
    + don't insert links to references in text body
* Writing style
  - no need to use passive voice, acceptable to use "I"/"we"
  - submit via easychair, converted to pdf

Most of this is taken care of by using the template provided and using the `bridges.sty`.

Note: quick command to convert pdf to grayscale `convert -colorspace GRAY  -density 400 -quality 100 Gilbert.pdf Gilbert_gs.pdf`

### From *"Bridges Style for Various Reference Types"*:

* follow periods after `vol.` and `no.` but before numbers with `~` (`vol. ~ 1`????)
* `\textit` for italics
* author names
  - first initial then last name
  - two authors joined by `and`
  - more than two, first `n-1` joined by commas and join last with and (comma before and aka oxford comma)
* no need to cite commonly used software
* *artwork* : `<name>. <title>, <date>. <medium>. <location>.`
* *artwork catalog* : `<name>. <title>, <catalog>, <url>.`
* *book* : `<name>. <title>, [edition.] <publisher>, <year>.`
* *book chapter* : `<name>. <chapter title>, In <book title>, edited by <editor>, <publisher>, <year>.`
* ... see the document



Paper Logistics
---

* Regular paper submission **Feb. 1st 2026**
  - Short paper submission **March 1st 2026**
* [Bridges 2026 call for submissions (regular papers)](https://www.bridgesmathart.org/b2026/bridges-2026-call-for-submissions/bridges-2026-regular-papers/)
* [Bridges 2026 paper formatting guidelines](https://www.bridgesmathart.org/for-authors-and-participants/formatting/)
  - [LaTeX template](https://www.bridgesmathart.org/wp-content/uploads/2024/01/BridgesPaperTemplate-LaTex-and-BibTex2024.zip)
  - [sample PDF](https://www.bridgesmathart.org/wp-content/uploads/2024/01/BridgesPaperTemplate2024-Latex.pdf)
* [Bridges 2026 paper submission process](https://www.bridgesmathart.org/for-authors-and-participants/submission/)
  - Program committee chair email: `papers@bridgesmathart.org`

