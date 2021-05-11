sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.sap.postActivity.controller.postActivity", {
		onInit: function (oEvent) {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/supplier.json"));
			this.getView().setModel(oModel);
			this.getView().bindElement("/SupplierCollection/0");
		}
	});
});