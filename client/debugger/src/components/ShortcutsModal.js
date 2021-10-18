/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import React, { Component } from "react";
import Modal from "./shared/Modal";
import classnames from "classnames";
import { formatKeyShortcut } from "../utils/text";

import "./ShortcutsModal.css";

export class ShortcutsModal extends Component {
  renderPrettyCombos(combo) {
    return combo
      .split(" ")
      .map(c => (
        <span key={c} className="keystroke">
          {c}
        </span>
      ))
      .reduce((prev, curr) => [prev, " + ", curr]);
  }

  renderShorcutItem(title, combo) {
    return (
      <li>
        <span>{title}</span>
        <span>{this.renderPrettyCombos(combo)}</span>
      </li>
    );
  }

  renderEditorShortcuts() {
    return (
      <ul className="shortcuts-list">
        {this.renderShorcutItem(
          L10N.getString("shortcuts.toggleBreakpoint"),
          formatKeyShortcut(L10N.getString("toggleBreakpoint.key"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.toggleCondPanel.breakpoint"),
          formatKeyShortcut(L10N.getString("toggleCondPanel.breakpoint.key"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.toggleCondPanel.logPoint"),
          formatKeyShortcut(L10N.getString("toggleCondPanel.logPoint.key"))
        )}
      </ul>
    );
  }

  renderSteppingShortcuts() {
    return (
      <ul className="shortcuts-list">
        {this.renderShorcutItem(L10N.getString("shortcuts.pauseOrResume"), "F8")}
        {this.renderShorcutItem(L10N.getString("shortcuts.stepOver"), "F10")}
        {this.renderShorcutItem(L10N.getString("shortcuts.stepIn"), "F11")}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.stepOut"),
          formatKeyShortcut(L10N.getString("stepOut.key"))
        )}
      </ul>
    );
  }

  renderSearchShortcuts() {
    return (
      <ul className="shortcuts-list">
        {this.renderShorcutItem(
          L10N.getString("shortcuts.fileSearch2"),
          formatKeyShortcut(L10N.getString("sources.search.key2"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.searchAgain2"),
          formatKeyShortcut(L10N.getString("sourceSearch.search.again.key3"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.projectSearch2"),
          formatKeyShortcut(L10N.getString("projectTextSearch.key"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.functionSearch2"),
          formatKeyShortcut(L10N.getString("functionSearch.key"))
        )}
        {this.renderShorcutItem(
          L10N.getString("shortcuts.gotoLine"),
          formatKeyShortcut(L10N.getString("gotoLineModal.key3"))
        )}
      </ul>
    );
  }

  renderShortcutsContent() {
    return (
      <div
        className={classnames("shortcuts-content", this.props.additionalClass)}
      >
        <div className="shortcuts-section">
          <h2>{L10N.getString("shortcuts.header.editor")}</h2>
          {this.renderEditorShortcuts()}
        </div>
        <div className="shortcuts-section">
          <h2>{L10N.getString("shortcuts.header.stepping")}</h2>
          {this.renderSteppingShortcuts()}
        </div>
        <div className="shortcuts-section">
          <h2>{L10N.getString("shortcuts.header.search")}</h2>
          {this.renderSearchShortcuts()}
        </div>
      </div>
    );
  }

  render() {
    const { enabled } = this.props;

    if (!enabled) {
      return null;
    }

    return (
      <Modal
        in={enabled}
        additionalClass="shortcuts-modal"
        handleClose={this.props.handleClose}
      >
        {this.renderShortcutsContent()}
      </Modal>
    );
  }
}
