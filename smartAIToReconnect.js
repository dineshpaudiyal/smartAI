/**
 * @description       :
 * @author            : Girish P
 * @group             :
 **/
import { LightningElement, wire, api, track } from "lwc";
import callSmartAI from "@salesforce/apex/SmartAIApi.callSmartAI";
import checkAccess from "@salesforce/apex/SmartAIApi.checkAccess";

export default class SmartAIToReconnect extends LightningElement {
	@api contactIds;
	@api listViewIds = [];
	@api listVieIds;
	_contactIds;
	loading = true;
	errorMessage =
		"Sorry, you do not have permission to access this feature. Please speak to your Administrator";
	notAccessible = false;
	domain = "";
	reconnectRedirectURL;
	@track
	isShowModal = false;

	async connectedCallback() {
		console.log(this.listViewIds);
		this.checkAccess();
		
	}
	async checkAccess() {
		let isAccesible = await checkAccess();
		if (!isAccesible) {
			console.log("invalid Profile");
			this.loading = false;
			this.notAccessible = true;
		} else {
			this.notAccessible = false;
			this._contactIds = JSON.stringify(this.listViewIds);
		}
	}

	renderedCallback() {
		console.log(this._contactIds);
	}

	@wire(callSmartAI, {
		smartAIURL: "$reconnectAPIPath",
		contactIds: "$_contactIds"
	})
	wireddata({ error, data }) {
		console.log("data-1");
		console.log(data);
		if (data) {
			console.log("if data" + data);
			this.handleShowModal();
			this.reconnectRedirectURL = JSON.parse(data).redirectURL;
			console.log(`$wwwwwthis._contactIds`, this.reconnectRedirectURL);
			this.loading = false;
		}
		if (error) {
			console.error(error);
		}
	}

	get reconnectAPIPath() {
		console.log(this.findBaseURL());
		// TODO add this to custom metdata configuration
		return `/api/customAction/Salesforce/Reconnect?cname=${this.findBaseURL()}`;
	}

	findBaseURL() {
		// inside flow redirection this was having extra --c in the name of domain due to redirection
		return /:\/\/([^\/]+)/.exec(window.location.href)[1].split("--c.")[0];
	}

	handleShowModal() {
		const modal = this.template.querySelector("c-modal");
		modal.show();
	}

	close() {
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(function () {
			window.history.back();
		}, 1000);
	}
}