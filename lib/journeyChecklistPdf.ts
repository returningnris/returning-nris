import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { JOURNEY_CHECKLIST, JOURNEY_FILTERS, type JourneyChecklistItem } from './moveBackContent'

type JourneyBucketId = 'mustDo' | 'ifRelevant' | 'niceToDo'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 42
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2

const BRAND = {
  saffron: rgb(1, 0.6, 0.2),
  saffronDark: rgb(0.8, 0.478, 0),
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

const BUCKETS: Array<{ id: JourneyBucketId; label: string; color: ReturnType<typeof rgb> }> = [
  { id: 'mustDo', label: 'Must do', color: BRAND.saffronDark },
  { id: 'ifRelevant', label: 'If relevant', color: BRAND.navy },
  { id: 'niceToDo', label: 'Nice to do', color: BRAND.green },
]

function getBucketItems(sectionId: string, bucketId: JourneyBucketId) {
  const section = JOURNEY_CHECKLIST.find((entry) => entry.id === sectionId)
  if (!section) return []

  if (bucketId === 'mustDo') return section.mustDo
  if (bucketId === 'ifRelevant') return section.ifRelevant
  return section.niceToDo
}

function getChecklistItemId(sectionId: string, bucketId: JourneyBucketId, itemIndex: number) {
  return `${sectionId}:${bucketId}:${itemIndex}`
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    const nextWidth = font.widthOfTextAtSize(nextLine, fontSize)

    if (nextWidth <= maxWidth || !currentLine) {
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

  page.drawRectangle({
    x,
    y: y - topHeight,
    width,
    height: topHeight,
    color: BRAND.saffron,
  })

  page.drawRectangle({
    x,
    y: y - topHeight - middleHeight,
    width,
    height: middleHeight,
    color: BRAND.panel,
  })

  page.drawRectangle({
    x,
    y: y - totalHeight,
    width,
    height: bottomHeight,
    color: BRAND.green,
  })

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

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let cursorY = PAGE_HEIGHT - PAGE_MARGIN

  const checkedItemSet = new Set(checkedItemIds)

  function addPage(withCompactHeader = true) {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    cursorY = PAGE_HEIGHT - PAGE_MARGIN

    if (withCompactHeader) {
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

  function drawWrappedParagraph(
    text: string,
    options: {
      x: number
      maxWidth: number
      size: number
      lineHeight: number
      font?: PDFFont
      color?: ReturnType<typeof rgb>
    }
  ) {
    const font = options.font || regularFont
    const color = options.color || BRAND.inkMuted
    const lines = wrapText(text, font, options.size, options.maxWidth)

    ensureSpace(lines.length * options.lineHeight)

    for (const line of lines) {
      page.drawText(line, {
        x: options.x,
        y: cursorY,
        size: options.size,
        font,
        color,
      })
      cursorY -= options.lineHeight
    }
  }

  function drawChecklistRow(item: JourneyChecklistItem, checked: boolean) {
    const checkboxSize = 11
    const textX = PAGE_MARGIN + checkboxSize + 12
    const maxTextWidth = CONTENT_WIDTH - checkboxSize - 12
    const itemLines = wrapText(item.text, regularFont, 10.5, maxTextWidth)
    const filterText =
      item.filters?.length
        ? `Relevant for: ${item.filters.map((filter) => FILTER_LABELS[filter]).join(', ')}`
        : ''
    const filterLines = filterText ? wrapText(filterText, regularFont, 8.5, maxTextWidth) : []
    const rowHeight = Math.max(checkboxSize, itemLines.length * 14 + filterLines.length * 11)

    ensureSpace(rowHeight + 10)

    page.drawRectangle({
      x: PAGE_MARGIN,
      y: cursorY - checkboxSize + 1,
      width: checkboxSize,
      height: checkboxSize,
      borderColor: checked ? BRAND.green : BRAND.inkMuted,
      borderWidth: 1,
      color: checked ? rgb(0.91, 0.968, 0.91) : BRAND.white,
    })

    if (checked) {
      page.drawLine({
        start: { x: PAGE_MARGIN + 2.5, y: cursorY - 5.5 },
        end: { x: PAGE_MARGIN + 5, y: cursorY - 8.5 },
        thickness: 1.4,
        color: BRAND.green,
      })
      page.drawLine({
        start: { x: PAGE_MARGIN + 5, y: cursorY - 8.5 },
        end: { x: PAGE_MARGIN + 8.8, y: cursorY - 2.5 },
        thickness: 1.4,
        color: BRAND.green,
      })
    }

    const textStartY = cursorY
    itemLines.forEach((line, index) => {
      page.drawText(line, {
        x: textX,
        y: textStartY - index * 14,
        size: 10.5,
        font: regularFont,
        color: BRAND.ink,
      })
    })

    filterLines.forEach((line, index) => {
      page.drawText(line, {
        x: textX,
        y: textStartY - itemLines.length * 14 - index * 11 - 1,
        size: 8.5,
        font: regularFont,
        color: BRAND.inkMuted,
      })
    })

    cursorY -= rowHeight + 10
  }

  drawLogo(page, PAGE_MARGIN, cursorY, 1.15, boldFont)
  page.drawText('Back2India Journey Checklist', {
    x: PAGE_MARGIN,
    y: cursorY - 50,
    size: 24,
    font: boldFont,
    color: BRAND.ink,
  })
  page.drawText('A complete move-back checklist for NRIs returning to India.', {
    x: PAGE_MARGIN,
    y: cursorY - 72,
    size: 11.5,
    font: regularFont,
    color: BRAND.inkMuted,
  })

  const checkedTotal = checkedItemIds.length
  const totalItems = JOURNEY_CHECKLIST.reduce(
    (sum, section) => sum + section.mustDo.length + section.ifRelevant.length + section.niceToDo.length,
    0
  )

  page.drawRectangle({
    x: PAGE_MARGIN,
    y: cursorY - 126,
    width: CONTENT_WIDTH,
    height: 42,
    color: BRAND.panelWarm,
    borderColor: BRAND.border,
    borderWidth: 1,
  })
  page.drawText(`${checkedTotal} of ${totalItems} items marked complete`, {
    x: PAGE_MARGIN + 14,
    y: cursorY - 110,
    size: 11,
    font: boldFont,
    color: BRAND.ink,
  })
  page.drawText(
    'This PDF includes all checklist sections and preserves any checked items from the page download.',
    {
      x: PAGE_MARGIN + 14,
      y: cursorY - 124,
      size: 9.5,
      font: regularFont,
      color: BRAND.inkMuted,
    }
  )

  cursorY -= 152

  drawWrappedParagraph(
    'Use this checklist as a practical planning document from early decision stage through the first year back in India.',
    {
      x: PAGE_MARGIN,
      maxWidth: CONTENT_WIDTH,
      size: 10.5,
      lineHeight: 15,
    }
  )

  cursorY -= 8

  for (const section of JOURNEY_CHECKLIST) {
    ensureSpace(44)

    page.drawRectangle({
      x: PAGE_MARGIN,
      y: cursorY - 20,
      width: CONTENT_WIDTH,
      height: 24,
      color: BRAND.panel,
      borderColor: BRAND.border,
      borderWidth: 1,
    })
    page.drawText(section.title, {
      x: PAGE_MARGIN + 12,
      y: cursorY - 12,
      size: 13,
      font: boldFont,
      color: BRAND.ink,
    })
    cursorY -= 34

    for (const bucket of BUCKETS) {
      const items = getBucketItems(section.id, bucket.id)
      if (!items.length) continue

      ensureSpace(28)
      page.drawText(bucket.label.toUpperCase(), {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 9,
        font: boldFont,
        color: bucket.color,
      })
      cursorY -= 16

      items.forEach((item, itemIndex) => {
        const itemId = getChecklistItemId(section.id, bucket.id, itemIndex)
        drawChecklistRow(item, checkedItemSet.has(itemId))
      })

      cursorY -= 4
    }

    cursorY -= 10
  }

  const pages = pdf.getPages()
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({
      start: { x: PAGE_MARGIN, y: PAGE_MARGIN - 6 },
      end: { x: PAGE_WIDTH - PAGE_MARGIN, y: PAGE_MARGIN - 6 },
      thickness: 1,
      color: BRAND.border,
    })
    pdfPage.drawText(`ReturningNRIs | Back2India Journey | Page ${index + 1} of ${pages.length}`, {
      x: PAGE_MARGIN,
      y: PAGE_MARGIN - 22,
      size: 8.5,
      font: regularFont,
      color: BRAND.inkMuted,
    })
  })

  return pdf.save()
}
