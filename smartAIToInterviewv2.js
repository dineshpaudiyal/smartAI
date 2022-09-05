
import { LightningElement, wire, api } from "lwc";
import callSmartAI from "@salesforce/apex/SmartAIApi.callSmartAI";
import checkScreeningPermission from "@salesforce/apex/SmartAIApi.checkScreeningPermission";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from "lightning/actions";

export default class SmartAIInterview extends LightningElement {
	@api listViewIds = [];
	@api contactIds;
	@api recordId;
	_contactIds;
	//this.loading = true;

/* function load smartAI Screening LWC */
	async connectedCallback() {
		console.log(this.listViewIds);
		this.checkUserScreeningAccess();
		
	}

/* function check whether user have permission to access smartAI Screening */
	async checkUserScreeningAccess() {
		let isAccesible = await checkScreeningPermission();
		if (!isAccesible) {
			console.log("invalid user for Screening");
			const evt = new ShowToastEvent({
				title: "error",
				message: "Sorry, you do not have permission to access this feature. Please speak to your Administrator",
				variant: "error"
			});
			this.dispatchEvent(evt);
			this.closeQuickAction();
		} else {
			this._contactIds = JSON.stringify(this.listViewIds);
		}
	}

	renderedCallback() {
		console.log(this._contactIds);
	}

	closeQuickAction() {
		this.dispatchEvent(new CloseActionScreenEvent());
	}

	/* function to send job application for smartAI Screening */
 	@wire(callSmartAI, {
		smartAIURL: "$interviewAPIPath",
		contactIds: "$_contactIds"
	})
	wireddata({ error, data }) {
		if (data) {
			console.log(data);
			// this.handleShowModal();
			const evt = new ShowToastEvent({
				title: "Success",
				message: "Application is successfully accepted by SmartAI",
				variant: "success"
			});
			//this.loading = false;
			this.dispatchEvent(evt);
			this.closeQuickAction();
		}
		if (error) {
			console.log(JSON.stringify(this.interviewAPIPath));
			console.error(error);
		}
	}
 
	/* function to get smartAI Screening callout endpoint address/path */
	get interviewAPIPath() {
		console.log(this.findBaseURL());
		return `/api/customAction/Salesforce/Screening?cname=${this.findBaseURL()}`;
	}

	/* function to get base url for smartAI Screening callout endpoint address/path */
	findBaseURL() {
		return /:\/\/([^\/]+)/.exec(window.location.href)[1].split(".")[0];
	}

	close() {
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(function () {
			window.history.back();
		}, 1000);
	} 
}
