/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Tests that the localization helper works properly.

const {
  LocalizationHelper,
  MultiLocalizationHelper,
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

  const multiLocalizationHelper = new MultiLocalizationHelper(
    "devtools/client/locales/startup.properties",
    "devtools/client/locales/toolbox.properties"
  );
  const str1 = await multiLocalizationHelper.getString("inspector.label");
  is(
    str1,
    "Inspector",
    "MultiLocalizationHelper could retrieve a string from startup.properties"
  );

  const str2 = await multiLocalizationHelper.getString("toolbox.defaultTitle");
  is(
    str2,
    "Developer Tools",
    "MultiLocalizationHelper could retrieve a string from toolbox.properties"
  );

  await Assert.rejects(
    multiLocalizationHelper.getString("missing.string"),
    /No localization found for \[missing\.string\]/,
    "MultiLocalizationHelper throws for a missing string"
  );
});
