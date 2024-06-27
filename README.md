# DVSA Driving Test Automation

80% of code from https://github.com/jethro-dev/dvsa-driving-test-booking-automation/tree/main

## Features

- Automated navigation through the DVSA driving test booking site
- Filling in driving license details, test dates, and centre name
- Random delays between actions to avoid detection
- Phone notifications through ntfy

# Prerequisites

- Tampermonkey or any other userscript manager
- A modern web browser (Chrome, Firefox, Edge, etc.)
- Use a VPN (optional, but can help with anti bot detection)
- Use Incognito mode or guest mode when using the script (optional, but can help avoid bot detection)

## Usage

- Navigate to the DVSA driving test booking website
- You need to manually click the green "Start now" button
- The script will then automatically start and navigate through the booking process.
- Toast notifications will appear to indicate the progress of the automation.

## Customization

- Driving License Number: Update the drivingLicenceNumber variable with your actual driving license number.
- Test Date: Update the testDate variable with your preferred test date.
- Centre Name: Update the centre name variable with your centre.
- Instructor Reference Number: Update the instructorReferenceNumber variable if applicable.
