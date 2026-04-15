import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { JOURNEY_FILTERS } from './moveBackContent'
import {
  getImportantTimelineSections,
  getJourneyChecklistItemId,
} from './journeyChecklistPresentation'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 42
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2

const BRAND = {
  saffron: rgb(1, 0.6, 0.2),
  green: rgb(0.075, 0.533, 0.031),
  navy: rgb(0, 0, 0.502),
  ink: rgb(0.102, 0.071, 0.031),
  inkMuted: rgb(0.361, 0.325, 0.274),
  border: rgb(0.89, 0.87, 0.84),
  panel: rgb(0.973, 0.961, 0.941),
  panelWarm: rgb(1, 0.973, 0.949),
  white: rgb(1, 1, 1),
}

const FILTER_LABELS = Object.fromEntries(JOURNEY_FILTERS.map((filter) => [filter.id, filter.label]))

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (font.widthOfTextAtSize(nextLine, fontSize) <= maxWidth || !currentLine) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function drawLogo(page: PDFPage, x: number, y: number, scale: number, boldFont: PDFFont) {
  const width = 26 * scale
  const topHeight = 9 * scale
  const middleHeight = 10 * scale
  const bottomHeight = 9 * scale
  const totalHeight = topHeight + middleHeight + bottomHeight

  page.drawRectangle({ x, y: y - topHeight, width, height: topHeight, color: BRAND.saffron })
  page.drawRectangle({ x, y: y - topHeight - middleHeight, width, height: middleHeight, color: BRAND.panel })
  page.drawRectangle({ x, y: y - totalHeight, width, height: bottomHeight, color: BRAND.green })
  page.drawCircle({
    x: x + width / 2,
    y: y - totalHeight / 2,
    size: 4 * scale,
    borderColor: BRAND.navy,
    borderWidth: 1.15 * scale,
  })
  page.drawCircle({
    x: x + width / 2,
    y: y - totalHeight / 2,
    size: 1.05 * scale,
    color: BRAND.navy,
  })

  const wordmarkY = y - totalHeight / 2 + 4.5 * scale
  page.drawText('Returning', {
    x: x + width + 8 * scale,
    y: wordmarkY,
    size: 11 * scale,
    font: boldFont,
    color: BRAND.saffron,
  })

  const returningWidth = boldFont.widthOfTextAtSize('Returning', 11 * scale)
  page.drawText('NRIs', {
    x: x + width + 8 * scale + returningWidth + 2 * scale,
    y: wordmarkY,
    size: 11 * scale,
    font: boldFont,
    color: BRAND.green,
  })
}

export async function buildJourneyChecklistPdf(checkedItemIds: string[] = []) {
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const checkedItemSet = new Set(checkedItemIds)
  const timelineSections = getImportantTimelineSections()

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let cursorY = PAGE_HEIGHT - PAGE_MARGIN

  function addPage(withHeader = true) {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    cursorY = PAGE_HEIGHT - PAGE_MARGIN

    if (withHeader) {
      drawLogo(page, PAGE_MARGIN, cursorY + 2, 0.8, boldFont)
      page.drawText('Back2India Journey Checklist', {
        x: PAGE_MARGIN,
        y: cursorY - 28,
        size: 12,
        font: boldFont,
        color: BRAND.ink,
      })
      page.drawLine({
        start: { x: PAGE_MARGIN, y: cursorY - 36 },
        end: { x: PAGE_WIDTH - PAGE_MARGIN, y: cursorY - 36 },
        thickness: 1,
        color: BRAND.border,
      })
      cursorY -= 54
    }
  }

  function ensureSpace(requiredHeight: number) {
    if (cursorY - requiredHeight < PAGE_MARGIN) {
      addPage(true)
    }
  }

  function drawWrapped(text: string, size: number, lineHeight: number, x = PAGE_MARGIN, width = CONTENT_WIDTH, font = regularFont, color = BRAND.inkMuted) {
    const lines = wrapText(text, font, size, width)
    ensureSpace(lines.length * lineHeight)

    for (const line of lines) {
      page.drawText(line, { x, y: cursorY, size, font, color })
      cursorY -= lineHeight
    }
  }

  drawLogo(page, PAGE_MARGIN, cursorY, 1.15, boldFont)
  page.drawText('Back2India Journey Checklist', {
    x: PAGE_MARGIN,
    y: cursorY - 50,
    size: 24,
    font: boldFont,
    color: BRAND.ink,
  })
  page.drawText('A cleaner, phase-by-phase checklist for NRIs returning to India.', {
    x: PAGE_MARGIN,
    y: cursorY - 72,
    size: 11.5,
    font: regularFont,
    color: BRAND.inkMuted,
  })

  const totalItems = timelineSections.reduce((sum, section) => sum + section.total, 0)
  const totalCompleted = timelineSections.reduce(
    (sum, section) =>
      sum +
      section.buckets.reduce(
        (bucketSum, bucket) =>
          bucketSum +
          bucket.items.reduce((itemSum, _item, itemIndex) => {
            const itemId = getJourneyChecklistItemId(section.id, bucket.id, itemIndex)
            return itemSum + (checkedItemSet.has(itemId) ? 1 : 0)
          }, 0),
        0
      ),
    0
  )

  page.drawRectangle({
    x: PAGE_MARGIN,
    y: cursorY - 126,
    width: CONTENT_WIDTH,
    height: 48,
    color: BRAND.panelWarm,
    borderColor: BRAND.border,
    borderWidth: 1,
  })
  page.drawText(`${totalCompleted} of ${totalItems} important items marked complete`, {
    x: PAGE_MARGIN + 14,
    y: cursorY - 108,
    size: 12,
    font: boldFont,
    color: BRAND.ink,
  })
  page.drawText('This PDF mirrors the shorter website checklist and keeps the design crisp for printing or sharing.', {
    x: PAGE_MARGIN + 14,
    y: cursorY - 123,
    size: 9.5,
    font: regularFont,
    color: BRAND.inkMuted,
  })

  cursorY -= 150

  timelineSections.forEach((section) => {
    addPage(true)

    page.drawText(`Phase ${section.index + 1}`, {
      x: PAGE_MARGIN,
      y: cursorY,
      size: 10,
      font: boldFont,
      color: BRAND.saffron,
    })
    cursorY -= 18

    page.drawText(section.title, {
      x: PAGE_MARGIN,
      y: cursorY,
      size: 20,
      font: boldFont,
      color: BRAND.ink,
    })
    cursorY -= 24

    drawWrapped('Only the most important items are shown below, matching the cleaner website view.', 10, 15)
    cursorY -= 6

    section.buckets.forEach((bucket) => {
      ensureSpace(52)

      page.drawRectangle({
        x: PAGE_MARGIN,
        y: cursorY - 24,
        width: CONTENT_WIDTH,
        height: 28,
        color: bucket.id === 'mustDo' ? BRAND.panelWarm : BRAND.panel,
        borderColor: BRAND.border,
        borderWidth: 1,
      })
      page.drawText(bucket.label, {
        x: PAGE_MARGIN + 12,
        y: cursorY - 14,
        size: 11,
        font: boldFont,
        color: BRAND.ink,
      })
      page.drawText(bucket.eyebrow, {
        x: PAGE_MARGIN + 86,
        y: cursorY - 14,
        size: 9,
        font: regularFont,
        color: BRAND.inkMuted,
      })
      cursorY -= 36

      bucket.items.forEach((item, itemIndex) => {
        const itemId = getJourneyChecklistItemId(section.id, bucket.id, itemIndex)
        const checked = checkedItemSet.has(itemId)
        const filterText = item.filters?.length
          ? `Relevant for: ${item.filters.map((filter) => FILTER_LABELS[filter]).join(', ')}`
          : ''
        const itemLines = wrapText(item.text, regularFont, 10.5, CONTENT_WIDTH - 30)
        const filterLines = filterText ? wrapText(filterText, regularFont, 8.5, CONTENT_WIDTH - 30) : []
        const blockHeight = Math.max(16, itemLines.length * 14 + filterLines.length * 11)

        ensureSpace(blockHeight + 12)

        page.drawRectangle({
          x: PAGE_MARGIN,
          y: cursorY - 12,
          width: 12,
          height: 12,
          borderColor: checked ? BRAND.green : BRAND.inkMuted,
          borderWidth: 1,
          color: checked ? rgb(0.91, 0.968, 0.91) : BRAND.white,
        })

        if (checked) {
          page.drawLine({
            start: { x: PAGE_MARGIN + 2.3, y: cursorY - 6.3 },
            end: { x: PAGE_MARGIN + 5.1, y: cursorY - 9.1 },
            thickness: 1.2,
            color: BRAND.green,
          })
          page.drawLine({
            start: { x: PAGE_MARGIN + 5.1, y: cursorY - 9.1 },
            end: { x: PAGE_MARGIN + 9.3, y: cursorY - 3.3 },
            thickness: 1.2,
            color: BRAND.green,
          })
        }

        itemLines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: PAGE_MARGIN + 20,
            y: cursorY - lineIndex * 14,
            size: 10.5,
            font: regularFont,
            color: BRAND.ink,
          })
        })

        filterLines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: PAGE_MARGIN + 20,
            y: cursorY - itemLines.length * 14 - lineIndex * 11 - 1,
            size: 8.5,
            font: regularFont,
            color: BRAND.inkMuted,
          })
        })

        cursorY -= blockHeight + 12
      })

      cursorY -= 4
    })
  })

  const pages = pdf.getPages()
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({
      start: { x: PAGE_MARGIN, y: PAGE_MARGIN - 6 },
      end: { x: PAGE_WIDTH - PAGE_MARGIN, y: PAGE_MARGIN - 6 },
      thickness: 1,
      color: BRAND.border,
    })
    pdfPage.drawText(`ReturningNRIs.com | Page ${index + 1} of ${pages.length}`, {
      x: PAGE_MARGIN,
      y: PAGE_MARGIN - 22,
      size: 8.5,
      font: regularFont,
      color: BRAND.inkMuted,
    })
  })

  return pdf.save()
}
