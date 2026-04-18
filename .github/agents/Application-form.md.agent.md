# MTU Application Form — Layout Specification

> This document defines the **exact layout, field structure, validation rules, and UI copy** for both variants of the MTU B.Tech Application Form.
> - **Form A:** JEE Pathway
> - **Form B:** Non-JEE Pathway
>
> The two forms are **identical in structure** except where explicitly noted. All differences are called out with `[NON-JEE ONLY]` or `[JEE ONLY]` tags.

---

## Global Notes

- All fields marked `*` are **mandatory**.
- Form spans **4 pages / sections** rendered as a multi-step flow.
- Candidate **cannot modify** branch preferences after final submission.
- A **passport-size photograph** must be uploaded (displayed in top-right of form header).

---

---

# FORM A — JEE Pathway

## Form Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                              Form Submission Fee:             │
│                                              Gen/OBC     — ₹100              │
│                                              SC/ST/PWD   — ₹50               │
│                                              IDP         — NIL               │
│                                              Last date of submission: 23rd May, 2025 │
│                                                                              │
│  [MTU Logo]   MANIPUR TECHNICAL UNIVERSITY                  ┌─────────────┐ │
│               (A University established under the Manipur   │  Paste your  │ │
│               Technical University Act, 2016)               │  recent      │ │
│               Recognised by UGC under Section 2(f) and      │  passport    │ │
│               Section 22 of UGC Act, 1956                   │  size        │ │
│               Website: www.mtu.ac.in | www.mtuonline.in     │  photograph  │ │
│                                                             │  here        │ │
│    Application Form for Admission to B. Tech Programme      │  (Do not     │ │
│    (JEE), 2025-26                                           │  staple)     │ │
│                                                             └─────────────┘ │
│   ┌──────────────────────────────┐                                           │
│   │     //For Office use only    │                                           │
│   └──────────────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Field:** `All the (*) marked fields are mandatory`

---

## Page 1 — Personal Details & Parent Details

### Section 1: PERSONAL DETAILS

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| First Name | Text | Yes (`*`) | 1/3 |
| Middle Name | Text | No | 1/3 |
| Last Name | Text | Yes (`*`) | 1/3 |

---

| Field Label | Input Type | Required | Width | Format |
|---|---|---|---|---|
| Date of Birth | Date | Yes (`*`) | 1/3 | DD/MM/YYYY |
| Gender | Text / Select | Yes (`*`) | 1/3 | — |
| Mobile Number | Tel | Yes (`*`) | 1/3 | — |

> **NB (inline notice below DOB field):**
> _"Date of Birth should fall on or after 31/07/2000. For OBC candidates, upper limit is relaxed by 3 years, SC/ST/PWD candidates, upper limit is relaxed by 5 years."_

---

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Email Address | Email | Yes (`*`) | 1/2 |
| Nationality | Text | Yes (`*`) | 1/2 |

---

**Category** — Checkbox group (select one):

| Option | Value |
|---|---|
| GEN | `GEN` |
| OBC | `OBC` |
| SC | `SC` |
| ST | `ST` |
| PWD | `PWD` |
| Transgender / Third Gender | `TG` |
| IDP | `IDP` |

> **NB (inline notice below Category field):**
> _"Candidates belonging to PWD/IDP category should also mention their social category i.e. Gen/OBC/SC/ST/IDP/Transgender/Third Gender."_

---

### Section 2: PARENTS'/GUARDIAN'S DETAILS

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Father's First Name | Text | Yes (`*`) | 1/3 |
| Father's Middle Name | Text | No | 1/3 |
| Father's Last Name | Text | Yes (`*`) | 1/3 |

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Mother's First Name | Text | Yes (`*`) | 1/3 |
| Mother's Middle Name | Text | No | 1/3 |
| Mother's Last Name | Text | Yes (`*`) | 1/3 |

---

## Page 2 — Guardian Contact & Address & Class X

### (Continuation of Section 2: PARENTS'/GUARDIAN'S DETAILS)

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Parents'/Guardian's Contact Number | Tel | Yes (`*`) | 1/2 |
| Parents'/Guardian's Email Address | Email | No | 1/2 |

---

### Section 3: ADDRESS DETAILS

#### Present Address / Relief Camp Details

| Field Label | Input Type | Required | Span |
|---|---|---|---|
| Present Address / Relief Camp Details | Textarea | Yes (`*`) | Full width |

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Country | Text / Select | Yes (`*`) | 1/3 |
| State | Text / Select | Yes (`*`) | 1/3 |
| District | Text / Select | Yes (`*`) | 1/3 |

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| City | Text | Yes (`*`) | 1/3 |
| Locality | Text | Yes (`*`) | 1/3 |
| Pin Code | Text (numeric, 6 digits) | Yes (`*`) | 1/3 |

#### Permanent Address

| Field Label | Input Type | Required | Span |
|---|---|---|---|
| Permanent Address | Textarea | Yes (`*`) | Full width |

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| Country | Text / Select | Yes (`*`) | 1/3 |
| State | Text / Select | Yes (`*`) | 1/3 |
| District | Text / Select | Yes (`*`) | 1/3 |

| Field Label | Input Type | Required | Width |
|---|---|---|---|
| City | Text | No | 1/3 |
| Locality | Text | Yes (`*`) | 1/3 |
| Pin Code | Text (numeric, 6 digits) | Yes (`*`) | 1/3 |

> **UI Note:** Consider a "Same as Present Address" checkbox to auto-fill Permanent Address.

---

### Section 4: EDUCATIONAL QUALIFICATION

#### A: Class X

Table with the following columns (multiple subject rows):

| Column | Input Type | Required |
|---|---|---|
| Name of School / Institute & Board | Text | Yes (`*`) |
| Year of Passing | Number (4-digit year) | Yes (`*`) |
| Subjects | Text (one per row) | Yes (`*`) |
| Full Marks | Number | Yes (`*`) |
| Marks Obtained | Number | Yes (`*`) |
| Percentage / Grade | Text | Yes (`*`) |

> **UI Note:** Render as a repeating table. The physical form shows 5–6 subject rows. Minimum 1 row required.

---

## Page 3 — Class XII, JEE Details & Branch Preferences

### (Continuation of Section 4: EDUCATIONAL QUALIFICATION)

#### B: Class XII

Table with the following columns (multiple subject rows):

| Column | Input Type | Required |
|---|---|---|
| Name of School / Institute & Board | Text | Yes (`*`) |
| Year of Passing | Number (4-digit year) | Yes (`*`) |
| Subjects | Text (one per row) | Yes (`*`) |
| Full Marks | Number | Yes (`*`) |
| Marks Obtained | Number | Yes (`*`) |
| Percentage / Grade | Text | Yes (`*`) |

> **UI Note:** Same repeating table pattern as Class X. Minimum 1 row required.

---

### Section 5: JOINT ENTRANCE EXAMINATION (JEE) DETAILS `[JEE ONLY]`

| Field Label | Input Type | Required | Span |
|---|---|---|---|
| Total score obtained in Joint Entrance Examination (JEE) 2025 | Number | Yes (`*`) | Full width |

> **UI Note:** This entire section is **shown only for JEE pathway candidates**. For Non-JEE candidates, this section is completely hidden/removed.

---

### Section 6: PREFERENCE OF BRANCHES FOR ADMISSION *(Priority Wise)*

Five ordered priority fields — candidate selects one branch per priority level with no duplicates:

| Priority | Input Type | Required |
|---|---|---|
| 1st | Select / Dropdown | Yes (`*`) |
| 2nd | Select / Dropdown | Yes (`*`) |
| 3rd | Select / Dropdown | Yes (`*`) |
| 4th | Select / Dropdown | Yes (`*`) |
| 5th | Select / Dropdown | Yes (`*`) |

**Available branch options (same for all 5 priorities):**

| # | Branch Name |
|---|---|
| 1 | Civil Engineering |
| 2 | Computer Science and Engineering |
| 3 | Electrical Engineering |
| 4 | Electronics and Communication Engineering |
| 5 | Mechanical Engineering |

> **Inline instruction text (shown below the priority fields):**
> _"Preference/Priority should be given from the following five branches."_

> **NB (bold notice block):**
> _"Candidates are informed to fill the preference of the branches carefully. The preference once filled up and submitted cannot be changed in any case. The seats in different branches shall be allotted strictly as per the preference/priority indicated in the application form."_

> **Validation Rule:** No duplicate branch selection across priority 1–5. All 5 priorities must be filled.

---

## Page 4 — Documents & Declaration

### Section 7: DOCUMENTS TO BE SUBMITTED ALONG WITH THE APPLICATION FORM

The following documents must be uploaded by the candidate:

| # | Document | Notes |
|---|---|---|
| 1 | Self-attested photocopy of Certificate of High School Leaving Certificate (HSLC) Examination or equivalent class 10th Examination | As proof of Date of Birth |
| 2 | Self-attested photocopy of Mark Sheet of High School Leaving Certificate (HSLC) Examination or equivalent class 10th Examination | — |
| 3 | Self-attested photocopy of Mark Sheet of Higher Secondary School Leaving Certificate (HSSLC) Examination or equivalent class 12th Examination | — |
| 4 | SC/ST/OBC/Internally Displaced Person (IDP)/Person with Disability (PWD)/Transgender/Third Gender Certificate *(if applicable)* | Mandatory if claiming reserved category seat |
| 5 | JEE (Main) 2025 Score Card `[JEE ONLY]` | — |

---

### Section 8: DECLARATION

**Declaration text (display as static read-only paragraph):**

> *"I do hereby solemnly declare that the information given above is correct to the best of my knowledge and belief. I am fully aware that I must submit self-attested copies of the certificates of my educational qualifications/final transcripts failing which my admission will stand cancelled. I will not request/claim for change of my preference of branches mentioned above. I am also aware that providing incorrect information in the application form can result in the cancellation of my admission at any stage."*

| Field Label | Input Type | Required | Layout |
|---|---|---|---|
| Place | Text | Yes (`*`) | Left column |
| Date | Date | Yes (`*`) | Left column |
| Signature of the applicant | File upload (JPG/PNG, max 200 KB) | Yes (`*`) | Right column |
| Name of the applicant | Text (auto-filled from Personal Details) | Yes (`*`) | Right column |

> **UI Note:** Add a mandatory checkbox: `[ ] I have read and agree to the above declaration` before enabling the final Submit button.

---
---

# FORM B — Non-JEE Pathway

> **This form is identical to Form A (JEE Pathway) with the following differences:**
> 1. The form **title** changes from `(JEE)` to `(Non-JEE)`.
> 2. **Section 5 (JEE Details) is entirely removed.**
> 3. **Document #5 (JEE Score Card) is removed** from the documents checklist.
>
> All other pages, sections, fields, labels, validation rules, and NB notices remain exactly the same.

---

## Form Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                              Form Submission Fee:             │
│                                              Gen/OBC     — ₹300              │
│                                              SC/ST/PWD   — ₹200              │
│                                              IDP         — NIL               │
│                                              Last date of submission: 23rd May, 2025 │
│                                                                              │
│  [MTU Logo]   MANIPUR TECHNICAL UNIVERSITY                  ┌─────────────┐ │
│               ...                                           │  Paste your  │ │
│                                                             │  recent      │ │
│    Application Form for Admission to B. Tech Programme      │  passport    │ │
│    (Non-JEE), 2025-26                                       │  size        │ │
│                                                             │  photograph  │ │
│   ┌──────────────────────────────┐                          │  here        │ │
│   │     //For Office use only    │                          │  (Do not     │ │
│   └──────────────────────────────┘                          │  staple)     │ │
│                                                             └─────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Page 1 — Personal Details & Parent Details

> ✅ **Identical to Form A — Page 1.** No changes.

All fields, labels, NB notices, and category checkboxes are the same as Form A.

---

## Page 2 — Guardian Contact & Address & Class X

> ✅ **Identical to Form A — Page 2.** No changes.

---

## Page 3 — Class XII & Branch Preferences `[MODIFIED]`

### (Continuation of Section 4: EDUCATIONAL QUALIFICATION)

#### B: Class XII

> ✅ **Identical to Form A — Page 3, Class XII table.** No changes.

---

### ~~Section 5: JOINT ENTRANCE EXAMINATION (JEE) DETAILS~~ `[REMOVED FOR NON-JEE]`

> ❌ **This entire section does not appear in the Non-JEE form.**
> The JEE score field is completely absent.

---

### Section 6: PREFERENCE OF BRANCHES FOR ADMISSION *(Priority Wise)*

> ✅ **Identical to Form A.** All 5 priority fields and branch options remain the same.
> All NB notices and validation rules remain the same.

---

## Page 4 — Documents & Declaration `[MODIFIED]`

### Section 7: DOCUMENTS TO BE SUBMITTED ALONG WITH THE APPLICATION FORM

| # | Document | Notes |
|---|---|---|
| 1 | Self-attested photocopy of Certificate of High School Leaving Certificate (HSLC) Examination or equivalent class 10th Examination | As proof of Date of Birth |
| 2 | Self-attested photocopy of Mark Sheet of High School Leaving Certificate (HSLC) Examination or equivalent class 10th Examination | — |
| 3 | Self-attested photocopy of Mark Sheet of Higher Secondary School Leaving Certificate (HSSLC) Examination or equivalent class 12th Examination | — |
| 4 | SC/ST/OBC/Internally Displaced Person (IDP)/Person with Disability (PWD)/Transgender/Third Gender Certificate *(if applicable)* | Mandatory if claiming reserved category seat |

> ❌ **Item 5 (JEE Main 2025 Score Card) is NOT present in the Non-JEE form.**

---

### Section 8: DECLARATION

> ✅ **Identical to Form A — Page 4 Declaration.** No changes.

---
---

# Diff Summary — JEE vs Non-JEE

| Element | Form A (JEE) | Form B (Non-JEE) |
|---|---|---|
| Form title | `B. Tech Programme (JEE), 2025-26` | `B. Tech Programme (Non-JEE), 2025-26` |
| Submission fee Gen/OBC | ₹100 | ₹300 |
| Submission fee SC/ST/PWD | ₹50 | ₹200 |
| Submission fee IDP | NIL | NIL |
| Page 1 — Personal Details | ✅ Same | ✅ Same |
| Page 1 — Parent Details | ✅ Same | ✅ Same |
| Page 2 — Guardian Contact | ✅ Same | ✅ Same |
| Page 2 — Address Details | ✅ Same | ✅ Same |
| Page 2 — Class X Table | ✅ Same | ✅ Same |
| Page 3 — Class XII Table | ✅ Same | ✅ Same |
| Page 3 — JEE Details Section | ✅ Present | ❌ Removed entirely |
| Page 3 — Branch Preferences | ✅ Same | ✅ Same |
| Page 4 — Documents list | 5 items (incl. JEE Score Card) | 4 items (JEE Score Card removed) |
| Page 4 — Declaration | ✅ Same | ✅ Same |