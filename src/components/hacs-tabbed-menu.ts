import "@polymer/paper-menu-button/paper-menu-button";
import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";

import { mdiDotsVertical } from "@mdi/js";

import { LitElement, customElement, property, html, css, TemplateResult } from "lit-element";
import { HomeAssistant, Route } from "../../homeassistant-frontend/src/types";
import { Status, LovelaceResource } from "../data/common";
import { settingsClearAllNewRepositories } from "../data/websocket";
import "../../homeassistant-frontend/src/components/ha-icon-button";

import "../components/hacs-link";
import "../components/hacs-icon-button";
import { Hacs } from "../data/hacs";

@customElement("hacs-tabbed-menu")
export class HacsTabbedMenu extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public hacs!: Hacs;
  @property({ attribute: false }) public narrow!: boolean;
  @property({ attribute: false }) public route!: Route;
  @property({ attribute: false }) public lovelace: LovelaceResource[];
  @property({ attribute: false }) public status: Status;

  protected render(): TemplateResult | void {
    return html`<paper-menu-button
      slot="toolbar-icon"
      horizontal-align="right"
      vertical-align="top"
      vertical-offset="40"
      close-on-activate
    >
      <hacs-icon-button .icon=${mdiDotsVertical} slot="dropdown-trigger"></hacs-icon-button>
      <paper-listbox slot="dropdown-content">
        <hacs-link url="https://hacs.xyz/"
          ><paper-item>${this.hacs.localize("menu.documentation")}</paper-item></hacs-link
        >
        ${this.route.path.split("/")[2] === "new"
          ? html` <paper-item @tap=${this._clearAllNewRepositories}
              >${this.hacs.localize("menu.dismiss")}</paper-item
            >`
          : ""}

        <hacs-link url="https://github.com/hacs"><paper-item>GitHub</paper-item></hacs-link>
        <hacs-link url="https://hacs.xyz/docs/issues">
          <paper-item> ${this.hacs.localize("menu.open_issue")} </paper-item>
        </hacs-link>

        <paper-item @tap=${this._showAboutDialog}>${this.hacs.localize("menu.about")}</paper-item>
      </paper-listbox>
    </paper-menu-button>`;
  }

  private async _clearAllNewRepositories() {
    await settingsClearAllNewRepositories(this.hass, [""]);
  }

  private _showAboutDialog() {
    this.dispatchEvent(
      new CustomEvent("hacs-dialog", {
        detail: {
          type: "about",
          configuration: this.hacs.configuration,
          repositories: this.hacs.repositories,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles() {
    return css`
      paper-menu-button {
        color: var(--hcv-text-color-secondary);
        padding: 0;
      }
      hacs-icon-button {
        color: var(--sidebar-icon-color);
      }
      paper-item {
        cursor: pointer;
      }
      paper-item-body {
        opacity: var(--dark-primary-opacity);
      }
    `;
  }
}
