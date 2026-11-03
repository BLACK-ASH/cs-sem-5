# Aldercrest University — seeded defects

The core student portal (home, login, records, preferences, documents) is intentionally
clean. All seeded faults are confined to the **IT service desk** page so that the rest of
the application behaves like a normal university portal.

This file is the answer key for manual testing. It is excluded from the Docker image and
is never served by nginx. Keep these defects in place between testing rounds unless you
are deliberately fixing them.

## Defect register

| ID | Area | Severity | Expected behaviour | Actual behaviour |
| --- | --- | --- | --- | --- |
| D-01 | Request queue — priority sorting | Medium | Priority sorts by severity: Urgent → High → Normal → Low (and the reverse when descending) | Sort treats priority as ordinary text, so ascending order is High → Low → Normal → Urgent |
| D-02 | Request queue — date filter | Medium | A From/To range includes requests opened on the To date | The To date is excluded, so a single-day range returns no requests |
| D-03 | Request queue — pagination | Medium | Five requests appear on each page and every request appears exactly once | Each page shows four requests; SD-1045 and SD-1050 are skipped entirely |
| D-04 | Request queue — clear filters | Low | Clearing filters returns to page 1 of the unfiltered queue | Clearing filters keeps the current page, so the list opens part-way through |
| D-05 | Appointment booking — availability | High | A slot marked “Fully booked” cannot be selected or booked | The 10:30 slot is marked fully booked but remains selectable and can be booked |
| D-06 | Appointment booking — time display | Low | A 12:00 appointment is confirmed as 12:00 PM | It is confirmed as 00:00 PM |
| D-07 | New request — mobile number | Medium | A mobile number must contain 10 digits | A 9-digit number is accepted |
| D-08 | New request — email address | Medium | An address without a domain suffix, such as `aarav@example`, is rejected | It is accepted and the request is submitted |
| D-09 | Service desk summary — average response | Low | Average first response uses the eight requests that have a recorded response (33.6 ÷ 8 = 4.2 h) | It divides by all 12 requests, counting unanswered requests as zero (33.6 ÷ 12 = 2.8 h) |

## Reproduction steps

### D-01 — Priority sorting is alphabetical

1. Open **IT desk** from the main navigation.
2. Select the **Priority** column heading once.
3. Page 1 lists High requests before Low. Continue to page 2 and page 3 to see Normal
   followed by Urgent.
4. Select the heading again; the reverse order ends with High instead of Low.

Expected: the urgency order Urgent, High, Normal, Low (or its reverse), not the
alphabetical order High, Low, Normal, Urgent.

### D-02 — End date is excluded

1. In the request queue, enter **2026-10-24** in both **From** and **To**.
2. Select **Apply**.
3. Two requests were opened on 24 October (SD-1046 and SD-1047), but the table is empty.

Expected: both requests are listed because the To date is inclusive.

### D-03 — Requests disappear at page boundaries

1. Clear any filters so all 12 requests are available.
2. Page 1 shows SD-1041 to SD-1044, then jumps to SD-1046 on page 2.
3. Page 2 shows SD-1046 to SD-1049, then jumps to SD-1051 on page 3.

Expected: five requests per page with no reference gaps. SD-1045 and SD-1050 are
currently never displayed, and the queue reports 12 requests while only 10 can be reached.

### D-04 — Clearing filters keeps the old page

1. Set **Status** to **Closed** and select **Apply**.
2. Select **Next** to move to page 2.
3. Select **Clear**.

Expected: the unfiltered queue returns to page 1. Actual: it remains on page 2, so the
first five requests are not shown.

### D-05 — Fully booked slot can be booked

1. In **Book a device check**, choose a future date.
2. Note that **10:30** is labelled **Fully booked**.
3. Select 10:30 and book the appointment.

Expected: a fully booked slot is disabled and cannot be chosen. Actual: the booking
succeeds.

### D-06 — Noon is shown as 00:00

1. Choose a future date and select the **12:00** slot.
2. Book the appointment.

Expected: the confirmation says 12:00 PM. Actual: it says **00:00 PM**.

### D-07 — Nine-digit mobile number accepted

1. In **Contact the service desk**, complete every field.
2. Enter a 9-digit number such as **987654321**.
3. Submit the request.

Expected: an error asks for a 10-digit number. Actual: the request is accepted.

### D-08 — Email address without a suffix accepted

1. Complete the request form using an address such as **aarav@example**.
2. Submit the request.

Expected: the address is rejected as invalid. Actual: the request is accepted.

### D-09 — Average response includes unanswered requests

1. In the request table, add the first-response values for the eight closed requests:
   3.2 + 4.5 + 2.0 + 5.5 + 3.0 + 7.0 + 2.5 + 5.9 = 33.6 hours.
2. Divide by the eight requests that have a response: 33.6 ÷ 8 = **4.2 h**.
3. The summary card shows **2.8 h**, which is 33.6 ÷ 12 (all requests).

Expected: 4.2 h. The four open or in-progress requests have no first response and should
not be included in the average.

## Scope notes

- The login form, student records, course preferences, service enquiry form, and document
  upload/download flows have no intentional faults in this build.
- The defects are triggered only through the interactions above; the page contains no
  visible hint that it is a test application.
