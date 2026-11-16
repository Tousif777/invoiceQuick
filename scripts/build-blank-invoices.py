#!/usr/bin/env python3
"""Build the two printable, unbranded blank invoice downloads."""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent


def build(paper, name):
    target = ROOT / 'downloads' / f'blank-invoice-{name}.pdf'
    c = canvas.Canvas(str(target), pagesize=paper, invariant=1)
    c.setTitle(f'Blank Invoice - {name.upper()}')
    c.setAuthor('QuickBillFree')
    width, height = paper
    left, right = 42, width - 42
    ink, rule = map(HexColor, ('#172033', '#B9C1CD'))

    def text(x, y, value, size=10, bold=False):
        c.setFillColor(ink)
        c.setFont('Helvetica-Bold' if bold else 'Helvetica', size)
        c.drawString(x, y, value)

    def line(x, y, end):
        c.setStrokeColor(rule)
        c.setLineWidth(.5)
        c.line(x, y, end, y)

    def field(x, y, label, end):
        text(x, y + 7, label, 8)
        line(x, y - 12, end)

    top = height - 48
    text(left, top, 'INVOICE', 26, True)
    field(right - 170, top, 'INVOICE NUMBER', right)
    field(left, top - 45, 'BUSINESS NAME', right - 200)
    field(right - 170, top - 45, 'ISSUE DATE', right)
    field(left, top - 82, 'ADDRESS', right - 200)
    field(right - 170, top - 82, 'PAYMENT DUE DATE', right)
    field(left, top - 119, 'EMAIL / PHONE', right - 200)
    field(right - 170, top - 119, 'CURRENCY', right)
    field(left, top - 164, 'BILL TO - CLIENT NAME / COMPANY', right)
    field(left, top - 201, 'CLIENT ADDRESS / CONTACT', right)
    field(left, top - 238, 'PROJECT / PURCHASE ORDER / TAX ID (IF APPLICABLE)', right)

    table_top = top - 274
    cols = [left, left + (right-left)*.51, left + (right-left)*.65,
            left + (right-left)*.82, right]
    c.setFillColor(HexColor('#EEF1F5'))
    c.rect(left, table_top - 25, right-left, 25, fill=1, stroke=0)
    for x, label in zip(cols, ('DESCRIPTION', 'QTY / HRS', 'RATE', 'AMOUNT')):
        text(x + 7, table_top - 16, label, 8, True)
    for row in range(7):
        line(left, table_top - 25 - 30*row, right)
    c.setStrokeColor(rule)
    for x in cols:
        c.line(x, table_top - 25, x, table_top - 205)

    bottom = table_top - 231
    for i, label in enumerate(('Subtotal', 'Tax (if applicable)', 'Total', 'Amount paid', 'Balance due')):
        y = bottom - i*25
        text(right - 213, y, label, 10, i in (2, 4))
        line(right - 100, y - 3, right)
    field(left, bottom, 'PAYMENT TERMS / INSTRUCTIONS', right - 245)
    line(left, bottom - 47, right - 245)
    line(left, bottom - 72, right - 245)
    line(left, bottom - 97, right - 245)
    text(left, 50, 'NOTES', 8, True)
    line(left, 33, right)
    c.showPage()
    c.save()
    print(target)


if __name__ == '__main__':
    build(A4, 'a4')
    build(letter, 'letter')
