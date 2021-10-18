/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import { bindActionCreators } from "redux";

import { copyToTheClipboard } from "../../../utils/clipboard";
import {
  getRawSourceURL,
  getFilename,
  shouldBlackbox,
} from "../../../utils/source";

import { downloadFile } from "../../../utils/utils";
import { features } from "../../../utils/prefs";

import { isFulfilled } from "../../../utils/async-value";
import actions from "../../../actions";

// Menu Items
export const continueToHereItem = (cx, location, isPaused, editorActions) => ({
  accesskey: L10N.getString("editor.continueToHere.accesskey"),
  disabled: !isPaused,
  click: () => editorActions.continueToHere(cx, location),
  id: "node-menu-continue-to-here",
  label: L10N.getString("editor.continueToHere.label"),
});

const copyToClipboardItem = (selectionText, editorActions) => ({
  id: "node-menu-copy-to-clipboard",
  label: L10N.getString("copyToClipboard.label"),
  accesskey: L10N.getString("copyToClipboard.accesskey"),
  disabled: selectionText.length === 0,
  click: () => copyToTheClipboard(selectionText),
});

const copySourceItem = (selectedContent, editorActions) => ({
  id: "node-menu-copy-source",
  label: L10N.getString("copySource.label"),
  accesskey: L10N.getString("copySource.accesskey"),
  disabled: false,
  click: () =>
    selectedContent.type === "text" &&
    copyToTheClipboard(selectedContent.value),
});

const copySourceUri2Item = (selectedSource, editorActions) => ({
  id: "node-menu-copy-source-url",
  label: L10N.getString("copySourceUri2"),
  accesskey: L10N.getString("copySourceUri2.accesskey"),
  disabled: !selectedSource.url,
  click: () => copyToTheClipboard(getRawSourceURL(selectedSource.url)),
});

const jumpToMappedLocationItem = (
  cx,
  selectedSource,
  location,
  hasMappedLocation,
  editorActions
) => ({
  id: "node-menu-jump",
  label: L10N.getFormatString(
    "editor.jumpToMappedLocation1",
    selectedSource.isOriginal
      ? L10N.getString("generated")
      : L10N.getString("original")
  ),
  accesskey: L10N.getString("editor.jumpToMappedLocation1.accesskey"),
  disabled: !hasMappedLocation,
  click: () => editorActions.jumpToMappedLocation(cx, location),
});

const showSourceMenuItem = (cx, selectedSource, editorActions) => ({
  id: "node-menu-show-source",
  label: L10N.getString("sourceTabs.revealInTree"),
  accesskey: L10N.getString("sourceTabs.revealInTree.accesskey"),
  disabled: !selectedSource.url,
  click: () => editorActions.showSource(cx, selectedSource.id),
});

const blackBoxMenuItem = (cx, selectedSource, editorActions) => ({
  id: "node-menu-blackbox",
  label: selectedSource.isBlackBoxed
    ? L10N.getString("ignoreContextItem.unignore")
    : L10N.getString("ignoreContextItem.ignore"),
  accesskey: selectedSource.isBlackBoxed
    ? L10N.getString("ignoreContextItem.unignore.accesskey")
    : L10N.getString("ignoreContextItem.ignore.accesskey"),
  disabled: !shouldBlackbox(selectedSource),
  click: () => editorActions.toggleBlackBox(cx, selectedSource),
});

const watchExpressionItem = (
  cx,
  selectedSource,
  selectionText,
  editorActions
) => ({
  id: "node-menu-add-watch-expression",
  label: L10N.getString("expressions.label"),
  accesskey: L10N.getString("expressions.accesskey"),
  click: () => editorActions.addExpression(cx, selectionText),
});

const evaluateInConsoleItem = (
  selectedSource,
  selectionText,
  editorActions
) => ({
  id: "node-menu-evaluate-in-console",
  label: L10N.getString("evaluateInConsole.label"),
  click: () => editorActions.evaluateInConsole(selectionText),
});

const downloadFileItem = (selectedSource, selectedContent, editorActions) => ({
  id: "node-menu-download-file",
  label: L10N.getString("downloadFile.label"),
  accesskey: L10N.getString("downloadFile.accesskey"),
  click: () => downloadFile(selectedContent, getFilename(selectedSource)),
});

const inlinePreviewItem = editorActions => ({
  id: "node-menu-inline-preview",
  label: features.inlinePreview
    ? L10N.getString("inlinePreview.hide.label")
    : L10N.getString("inlinePreview.show.label"),
  click: () => editorActions.toggleInlinePreview(!features.inlinePreview),
});

const editorWrappingItem = (editorActions, editorWrappingEnabled) => ({
  id: "node-menu-editor-wrapping",
  label: editorWrappingEnabled
    ? L10N.getString("editorWrapping.hide.label")
    : L10N.getString("editorWrapping.show.label"),
  click: () => editorActions.toggleEditorWrapping(!editorWrappingEnabled),
});

export function editorMenuItems({
  cx,
  editorActions,
  selectedSource,
  location,
  selectionText,
  hasMappedLocation,
  isTextSelected,
  isPaused,
  editorWrappingEnabled,
}) {
  const items = [];

  const content =
    selectedSource.content && isFulfilled(selectedSource.content)
      ? selectedSource.content.value
      : null;

  items.push(
    jumpToMappedLocationItem(
      cx,
      selectedSource,
      location,
      hasMappedLocation,
      editorActions
    ),
    continueToHereItem(cx, location, isPaused, editorActions),
    { type: "separator" },
    copyToClipboardItem(selectionText, editorActions),
    ...(!selectedSource.isWasm
      ? [
          ...(content ? [copySourceItem(content, editorActions)] : []),
          copySourceUri2Item(selectedSource, editorActions),
        ]
      : []),
    ...(content
      ? [downloadFileItem(selectedSource, content, editorActions)]
      : []),
    { type: "separator" },
    showSourceMenuItem(cx, selectedSource, editorActions),
    blackBoxMenuItem(cx, selectedSource, editorActions)
  );

  if (isTextSelected) {
    items.push(
      { type: "separator" },
      watchExpressionItem(cx, selectedSource, selectionText, editorActions),
      evaluateInConsoleItem(selectedSource, selectionText, editorActions)
    );
  }

  items.push(
    { type: "separator" },
    inlinePreviewItem(editorActions),
    editorWrappingItem(editorActions, editorWrappingEnabled)
  );

  return items;
}

export function editorItemActions(dispatch) {
  return bindActionCreators(
    {
      addExpression: actions.addExpression,
      continueToHere: actions.continueToHere,
      evaluateInConsole: actions.evaluateInConsole,
      flashLineRange: actions.flashLineRange,
      jumpToMappedLocation: actions.jumpToMappedLocation,
      showSource: actions.showSource,
      toggleBlackBox: actions.toggleBlackBox,
      toggleInlinePreview: actions.toggleInlinePreview,
      toggleEditorWrapping: actions.toggleEditorWrapping,
    },
    dispatch
  );
}
