/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Tests that the localization helper works properly.

const {
  LocalizationHelper,
} = require("devtools/shared/l10n");

add_task(async function() {
  const localizationHelper = new LocalizationHelper(
    "devtools/client/locales/startup.properties"
  );
  const simpleString = await localizationHelper.getString("inspector.label");
  is(simpleString, "Inspector", "LocalizationHelper could localize a string");

  const formattedString = await localizationHelper.getFormatString(
    "inspector.tooltip2",
    "test"
  );
  is(
    formattedString,
    "DOM and Style Inspector (test)",
    "LocalizationHelper could format a string with a parameter"
  );
});
