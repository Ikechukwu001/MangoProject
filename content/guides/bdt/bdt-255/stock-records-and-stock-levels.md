---
title: "Stock Records and Stock Levels"
subject: "BDT"
course: "BDT 255"
courseTitle: "Logistics and Supply Chain Management"
order: 4
readingTime: 9
description: "The bin card, tally card and ledger; terms used in stock keeping; and how minimum, reorder and maximum stock levels help monitor stock and prevent stock-outs."
objectives:
  - "Describe the bin card, tally card and ledger and what each records"
  - "Keep a record of receipts, issues and balances"
  - "Explain terms used in stock keeping"
  - "Calculate minimum, reorder and maximum stock levels"
  - "Describe how to monitor stock and prevent stock-outs"
  - "Explain why bin cards and ledgers must agree with the shelf"
keyPoints:
  - "A bin card (or tally card) is kept with the stock on the shelf. The ledger is kept in the office or store records."
  - "Each receipt is added and each issue is subtracted, and the new balance is written each time."
  - "The shelf count, the bin card and the ledger should all give the same balance."
  - "Minimum stock = AMC × safety stock months."
  - "Reorder level = (AMC × lead time) + minimum stock."
  - "Maximum stock = minimum stock + (AMC × ordering interval)."
  - "A stock-out is prevented by watching the reorder level, ordering on time, and checking records regularly."
examFocus:
  - "Draw or describe a bin card with receipts, issues and balance."
  - "Balance a card or ledger after a series of receipts and issues."
  - "Calculate the minimum, reorder and maximum stock levels from the AMC, lead time and ordering interval."
  - "Common mistake: forgetting to carry the balance forward after each entry."
quickCheck:
  - question: "A bin card shows an opening balance of 500, then receives 300, then issues 200 and 150. What is the balance?"
    options:
      - "950"
      - "450"
      - "650"
      - "1 150"
    answer: 1
    explanation: "500 + 300 = 800. Then 800 − 200 − 150 = 450."
  - question: "The bin card shows 450 tablets but a count of the shelf finds 440. This means:"
    options:
      - "There is a deficiency of 10 that must be investigated"
      - "There is a surplus of 10"
      - "The records are correct"
      - "The count should be thrown away"
    answer: 0
    explanation: "The shelf has 10 fewer than the record. A deficiency needs to be investigated and explained, not ignored."
  - question: "AMC = 200, lead time = 1 month, safety stock = 1 month. What is the reorder level?"
    options:
      - "200"
      - "800"
      - "400"
      - "600"
    answer: 2
    explanation: "Minimum stock = 200 × 1 = 200. Reorder level = 200 × 1 + 200 = 400."
  - question: "AMC = 200, safety stock = 1 month, ordering interval = 2 months. What is the maximum stock?"
    options:
      - "400"
      - "200"
      - "800"
      - "600"
    answer: 3
    explanation: "Minimum = 200. Maximum = 200 + (200 × 2) = 600."
  - question: "Which term describes stock that has been ordered but has not yet been received?"
    options:
      - "Dues-in"
      - "Dues-out"
      - "Earmarked stock"
      - "Surplus"
    answer: 0
    explanation: "Dues-in is stock expected from a supplier. Dues-out is stock promised to a unit but not yet issued."
---

## Why keep stock records?

Records tell you **what you have, what came in, what went out, and what is left**. They are the basis for ordering, and they are the evidence that nothing has been lost. Without them, you cannot prevent stock-outs or find where a loss happened.

## The records

| Record | Where it is kept | What it shows |
|---|---|---|
| Bin card (stock card) | With the stock, on the shelf or bin | Receipts, issues and balance for one item |
| Tally card | Used in the same way as a bin card, to keep a running count | Quantities in and out, and the balance |
| Ledger (stock ledger) | In the store office | Receipts, issues and balance for each item, kept apart from the stock |
| Receipt and issue vouchers | Filed in order | The documents behind each entry |

The bin card gives a quick answer at the shelf. The ledger is the **independent check**, kept by a different person where possible.

### Layout of a bin card

| Date | Voucher no. | Received from / Issued to | Received | Issued | Balance |
|---|---|---|---|---|---|
| 1 Oct | | Opening balance | | | 500 |
| 3 Oct | RV 12 | Supplier | 300 | | 800 |
| 7 Oct | IV 31 | Ward A | | 200 | 600 |
| 12 Oct | IV 35 | Clinic B | | 150 | 450 |

The **balance** is worked out after every entry:

```
new balance = previous balance + received − issued
```

## Terms used in stock keeping

| Term | Meaning |
|---|---|
| Stock on hand | The quantity actually in the store now |
| Dues-in | Stock that has been ordered but not yet received |
| Dues-out | Stock promised to a unit but not yet issued |
| Earmarked stock | Stock kept aside for a particular unit or purpose, and not to be issued to others |
| Target figure | The stock level that the store aims to hold |
| Provision | The quantity needed, worked out from use, to bring the stock to its target |
| Rate of use | How much of an item is used in a period |

Services and organisations use some of these words differently, so use the meanings in your textbook and your workplace. The ideas are the same everywhere.

## Checking the records

A regular **stock check** compares three things:

1. the **physical count** on the shelf;
2. the **bin card** balance;
3. the **ledger** balance.

All three should agree. If they do not, the difference is a **deficiency** (less than the record) or a **surplus** (more than the record). Both must be **investigated**, explained, and corrected with a proper entry that is approved. Never change a record by writing over it.

**Example.** *The ledger shows 450 tablets. The shelf count is 440.*

- Deficiency = 450 − 440 = **10 tablets**

## Stock levels

Stock levels are limits that tell the store keeper when to order and how much to hold. They use the **AMC** (average monthly consumption), the **lead time** and the **ordering interval**.

```
minimum stock = AMC × safety stock (months)
reorder level = (AMC × lead time) + minimum stock
maximum stock = minimum stock + (AMC × ordering interval)
```

- The **minimum stock** (safety stock) is the lowest the stock should fall. Going below it risks a stock-out.
- The **reorder level** is the stock at which a new order must be placed. At this point, the stock left covers the lead time and still leaves the minimum stock when the order arrives.
- The **maximum stock** is the most that should be held. Above it, money is tied up and medicines may expire.

### Worked example

*AMC = 200 tablets. Safety stock = 1 month. Lead time = 1 month. Ordering interval = 2 months.*

1. Minimum stock = 200 × 1 = **200**
2. Reorder level = (200 × 1) + 200 = **400**
3. Maximum stock = 200 + (200 × 2) = **600**

**Check.** At the reorder level of 400, the order is placed. During the 1-month lead time, 200 are used, leaving 200 (the minimum) when the delivery arrives. If the order is for 400 (the AMC × the 2-month interval), the stock rises to **600**, which is the maximum.

## Monitoring and preventing stock-outs

A **stock-out** is when a medicine is not available when a patient needs it.

| Cause | How to prevent it |
|---|---|
| Ordering too late | Watch the reorder level, and order when stock reaches it |
| Order too small | Base the quantity on records, and include lead time and safety stock |
| Long delays in delivery | Add the real lead time, and keep a safety stock |
| Sudden rise in use | Allow for seasons and outbreaks, and review the AMC |
| Stock wasted by expiry or damage | FEFO, regular checks, correct storage |
| Poor records | Keep bin cards and ledgers up to date and checked |
| Pending orders forgotten | Record dues-in, and follow up the supplier |

Good practice:

- Check the balance of each item **regularly**, for example weekly for fast-moving items.
- Keep a **list of items near or below the reorder level**.
- Record every **stock-out**, with its length, and use it to adjust the safety stock.
- Keep contact with **nearby units** that can lend a small amount in an emergency, and record the loan.
