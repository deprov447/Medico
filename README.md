# Medico

> Project submission for [Optum Stratethon - Season 3](https://dare2compete.com/competition/optum-stratethon-season-3-optum-part-of-the-unitedhealth-group-family-of-businesses-216741)

## Team - **Int_overflow**

- [Anubhav Choudhary](mailto:b119010@iiit-bh.ac.in) [Leader]
- [Anurag Goel](mailto:b119011@iiit-bh.ac.in)
- [Aadarsh Singh](mailto:b119001@iiit-bh.ac.in)

## Problem Statement

Medication nonadherence refers to patients not taking their prescribed medications at required frequency or prematurely abandoning the treatment process. Not only does it hurts the patient with delayed curing and unexpected outcomes, but it puts huge burden on already stressed healthcare ecosystem. Ensuring medical adherence can ease burden from healthcare ecosystem and reduce overall healthcare cost for all the stakeholders including UnitedHealthcare, largest health insurance company in the U.S. with approximately 70 million members.

## Solution

The solution we propose is a credit-based-reward system, which will encourage the users to not only stick to the full medication course for better curing process but also to enjoy insurance benefits and discounts on medical bills.

Insurance companies face a lot of damage due to improper medication procedure. Using this system, they can also ensure that the patient is regular and develop reputations for individual patient on basis of whether or not they stick to the medication, and then systematically reward them.

[Medico](https://medico.deprov447.tech/) is our prototype for the proposed solution. It is a progressive web app, which can be used either through the [website](https://medico.deprov447.tech/) or using the native app (available on the website).

Please watch this [youtube](#) video for a walkthrough to Medico's features and functionalities.

## Tech stack used

- WorkBox-SW for service worker libraries
- Web-push for push notification
- Docker
- NodeMailer
- Express.js
- EJS
- MongoDB
- JSONWebToken

## Data

The dummy data for the application is generated by [synthea](https://github.com/synthetichealth/synthea) and is located [here](https://d8it4huxumps7.cloudfront.net/files/616d761088e87_sample_date_csv_1.zip).

The raw data was parsed to [result.csv](https://github.com/deprov447/optum/blob/master/result.csv) using:

```sql
SELECT * FROM

(SELECT patients.*, SUM(procedures.BASE_COST)
FROM patients
INNER JOIN procedures ON procedures.PATIENT = patients.Id
GROUP BY procedures.PATIENT) AS patProc

INNER JOIN

(SELECT patients.Id as tempID, SUM(medications.TOTALCOST)
FROM patients
INNER JOIN medications ON medications.PATIENT = patients.Id
GROUP BY medications.PATIENT) AS patMed

ON patProc.Id = patMed.TempID
```