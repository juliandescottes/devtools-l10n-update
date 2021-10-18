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
function BundleHelper(bundleName) {
  this.bundleName = bundleName;
}

BundleHelper.prototype = {
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
   * L10N shortcut function. Can be used with a single string or an array of
   * strings.
   *
   * @param {String|Array} name
   * @return {String}
   */
  getString: async function(name) {
    if (Array.isArray(name)) {
      const strings = [];

      for (const i = 0; i < name.length; i++) {
        const properties = await this.fetchBundle();
        if (name[i] in properties) {
          strings.push(properties[name]);
        } else {
          throw new Error("No localization found for [" + name[i] + "]");
        }
      }
      return strings;
    }

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
function LocalizationHelper(...bundleNames) {
  if (Array.isArray(bundleNames[0])) {
    console.log("Support passing a single array argument");
    bundleNames = bundleNames[0];
  }

  const instances = bundleNames.map(b => {
    return new BundleHelper(b);
  });

  // Get all function members of the LocalizationHelper class, making sure we're
  // not executing any potential getters while doing so, and wrap all the
  // methods we've found to work on all given string bundles.
  Object.getOwnPropertyNames(BundleHelper.prototype)
    .map(n => ({
      name: n,
      descriptor: Object.getOwnPropertyDescriptor(BundleHelper.prototype, n),
    }))
    .filter(({ descriptor }) => descriptor.value instanceof Function)
    .forEach(method => {
      this[method.name] = (...args) => {
        for (const i of instances) {
          try {
            return method.descriptor.value.apply(i, args);
          } catch (e) {
            // Do nothing
          }
        }
        throw new Error("No localization found for [" + args[0] + "]");
      };
    });
}

exports.LocalizationHelper = LocalizationHelper;
