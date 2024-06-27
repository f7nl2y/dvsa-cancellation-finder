// ==UserScript==
// @name         DVSA Driving Test Booking Automation
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Automate the driving test booking process and notify when a slot is available.
// @author       jethro-dev (f7nl2y modified)
// @match        https://driverpracticaltest.dvsa.gov.uk/application*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const drivingLicenceNumber = ""; // Set to your driver licence
  const testDate = "15/07/2024"; // Set your desired test date, format in DD/MM/YYYY
  const preferredDate = "2024-07-15"; // Your preferred date
  const minDate = "2024-07-18"; // Minimum date to start checking
  const maxDate = "2024-08-31"; // Maximum date to stop checking
  const instructorReferenceNumber = ""; // Set to the instructor's reference number or leave as null if not applicable
  const centre = "Llanishen";
  const minDelay = 2000; // Minimum delay in milliseconds
  const maxDelay = 4000; // Maximum delay in milliseconds
  const NTFY_TOPIC = "Slots"; // Set your ntfy.sh topic

  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDelay(callback) {
    const delay = randomIntBetween(minDelay, maxDelay); // Random delay between minDelay and maxDelay
    setTimeout(callback, delay);
  }

  function scrollToElement(element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function step1() {
    console.log("Running step 1...");
    const testTypeCarBtn = document.querySelector("#test-type-car");
    if (testTypeCarBtn) {
      testTypeCarBtn.click();
    }
  }

  function step2() {
    console.log("Running step 2...");
    const drivingLicenceInput = document.querySelector("#driving-licence");
    if (drivingLicenceInput) {
      drivingLicenceInput.value = drivingLicenceNumber;
    }

    const specialNeedsNoneInput = document.querySelector("#special-needs-none");
    if (specialNeedsNoneInput) {
      specialNeedsNoneInput.checked = true;
    }

    const submitBtn = document.querySelector("#driving-licence-submit");
    if (submitBtn) {
      submitBtn.click();
    }
  }

  function step3() {
    console.log("Running step 3...");
    const testDateInput = document.querySelector("#test-choice-calendar");
    if (testDateInput) {
      testDateInput.value = testDate;
    }

    if (instructorReferenceNumber !== null) {
      const instructorInput = document.querySelector("#instructor-prn");
      if (instructorInput) {
        instructorInput.value = instructorReferenceNumber;
      }
    }

    const submitBtn = document.querySelector("#driving-licence-submit");
    if (submitBtn) {
      submitBtn.click();
    }
  }

  function step4() {
    console.log("Running step 4...");
    // Choose centre directly
    const centreInput = document.querySelector("#test-centres-input");
    if (centreInput) {
      centreInput.value = centre;
    }

    const submitBtn = document.querySelector("#test-centres-submit");
    if (submitBtn) {
      submitBtn.click();
    }

    const centreResult = document.querySelector(
      "#centre-name-4585.test-centre-details-link"
    );

    if (centreResult) {
      centreResult.click();
    }

    const interval = randomIntBetween(30000, 60000);
    console.log("Sleeping for " + interval / 1000 + "s");
    setTimeout(() => {
      document.location.href =
        "https://driverpracticaltest.dvsa.gov.uk/application";
    }, interval);
  }

  function step5() {
    console.log("Running step 5...");
    let currentDate = new Date(minDate);
    const endDate = new Date(maxDate);
    let availableSlots = [];

    function isDateAvailable(tdElement) {
      return (
        tdElement &&
        tdElement.classList.contains("BookingCalendar-date--bookable")
      );
    }

    function checkAvailableDates() {
      const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // format YYYY-MM-DD
      console.log(
        "Checking dates for month:",
        formattedCurrentDate.slice(0, 7)
      );

      const dateElements = document.querySelectorAll(
        `.BookingCalendar-dateLink[data-date^="${formattedCurrentDate.slice(
          0,
          7
        )}"]`
      );
      dateElements.forEach((dateElement) => {
        const date = dateElement.getAttribute("data-date");
        const tdElement = dateElement.closest("td");
        if (isDateAvailable(tdElement) && date >= minDate && date <= maxDate) {
          availableSlots.push(date);
          console.log("Available date found:", date);
        } else {
          console.log("Date unavailable or out of range:", date);
        }
      });

      if (currentDate <= endDate) {
        const nextMonthButton = document.querySelector(
          ".BookingCalendar-nav--next.is-active"
        );
        if (nextMonthButton) {
          nextMonthButton.click();
          currentDate.setMonth(currentDate.getMonth() + 1);
          setTimeout(checkAvailableDates, randomIntBetween(minDelay, maxDelay));
        } else {
          console.log("No further navigation button found.");
          notifyAvailableSlots();
        }
      } else {
        notifyAvailableSlots();
      }
    }

    // Notify available slots via ntfy.sh
    function notifyAvailableSlots() {
      let title, body, tags;
      if (availableSlots.length > 0) {
        title = "SLOT FOUND NO FUCKING WAY";
        body = `GO GET IT MY NIGGA: ${availableSlots.join(", ")}`;
        tags = "flushed";
      } else {
        title = "no slots found lil nigga";
        body = "WOMP WOMp";
        tags = "middle_finger";
      }
      fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: "POST",
        headers: {
          Title: title,
          Tags: tags,
          Priority: "default",
          Actions:
            "view, go book if they are available, https://driverpracticaltest.dvsa.gov.uk/login;",
        },
        body: body,
      })
        .then(() => {
          console.log("Notification sent:", body);
        })
        .catch((error) => {
          console.error("Error sending notification:", error);
        });

      setTimeout(() => {
        location.reload();
      }, 1200000); // 20 minutes in milliseconds
    }
    // Start checking available dates
    checkAvailableDates();
  }

  function handlePage() {
    switch (document.title) {
      case "Type of test":
        randomDelay(step1);
        break;
      case "Licence details":
        randomDelay(step2);
        break;
      case "Test date":
        randomDelay(step3);
        break;
      case "Test centre":
        randomDelay(step4);
        break;
      case "Test date / time — test times available":
        randomDelay(step5);
        break;
      default:
        console.log("Unknown page title:", document.title);
        break;
    }
  }

  // Ensure the script runs after the page is fully loaded
  window.addEventListener("load", () => {
    randomDelay(handlePage);
  });
})();
