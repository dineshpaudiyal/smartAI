/**
 * @description       :
 * @author            : Girish P
 * @group             :
 **/
import { LightningElement, api } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";
import getMetaData from "@salesforce/apex/SmartAIApi.getMetaData";

export default class SmartAIJob extends LightningElement {
	url = "";
	showCard = false;
	@api recordId;
	connectedCallback() {
		this.panel();
	}
	get iframeURL() {
		this.showCard = true;
		return this.url;
	}
	panel() {
		getMetaData({ metaName: "jobOrderURL" }).then((data) => {
			console.log(data);
			this.url = `${
				data.value__c
			}/#/externaljoborder?platform=salesforce&cname=${this.findBaseURL()}&jobId=${
				this.recordId
			}`;
			console.log(this.url);
			this.showCard = true;
		});
	}
	refresh() {
		this.showCard = false;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(() => {
			this.showCard = true;
		}, 2);
	}

	closeAction() {
		this.dispatchEvent(new CloseActionScreenEvent());
	}
	findBaseURL() {
		return /:\/\/([^\/]+)/.exec(window.location.href)[1].split(".")[0];
		//this.url = 'https://dcplwc-dev-ed.lightning.force.com/lightning/r/Contact/0032x000003OUFVAA4/view';
	}
}