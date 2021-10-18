/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const parsePropertiesFile = require("devtools/shared/node-properties/node-properties");
const { sprintf } = require("devtools/shared/sprintfjs/sprintf");

/**
 * Localization convenience methods.
 *
 * @param string bundleName
 *        The desired string bundle's name.
 */
function LocalizationHelper(bundleName) {
  this.bundleName = bundleName;
}

LocalizationHelper.prototype = {
  /**
   * Download and parse the localized strings bundle.
   *
   * @return {Object} parsed properties mapped in an object.
   */
  fetchBundle: async function() {
    const propertiesFile = await fetch("raw!" + this.bundleName);
    return parsePropertiesFile(propertiesFile);
  },

  /**
   * L10N shortcut function.
   *
   * @param {String} name
   * @return {String}
   */
  getString: async function(name) {
    const properties = await this.fetchBundle();
    if (name in properties) {
      return properties[name];
    }
    throw new Error("No localization found for [" + name + "]");
  },

  /**
   * L10N shortcut function.
   *
   * @param {String} name
   * @param {Array} args
   * @return {String}
   */
  getFormatString: async function(name, ...args) {
    const string = await this.getString(name);
    return sprintf(string, ...args);
  },
};

/**
 * A helper for having the same interface as LocalizationHelper, but for more
 * than one file. Useful for abstracting l10n string locations.
 */
function MultiLocalizationHelper(...bundleNames) {
  const instances = bundleNames.map(bundle => {
    return new LocalizationHelper(bundle);
  });

  // Get all function members of the LocalizationHelper class, making sure we're
  // not executing any potential getters while doing so, and wrap all the
  // methods we've found to work on all given string bundles.
  Object.getOwnPropertyNames(LocalizationHelper.prototype)
    .map(name => ({
      name: name,
      descriptor: Object.getOwnPropertyDescriptor(
        LocalizationHelper.prototype,
        name
      ),
    }))
    .filter(({ descriptor }) => descriptor.value instanceof Function)
    .forEach(method => {
      this[method.name] = (...args) => {
        for (const l10n of instances) {
          try {
            return method.descriptor.value.apply(l10n, args);
          } catch (e) {
            // Do nothing
          }
        }
        throw new Error("No localization found for [" + args[0] + "]");
      };
    });
}

exports.LocalizationHelper = LocalizationHelper;
exports.MultiLocalizationHelper = MultiLocalizationHelper;
