sap.ui.define([
	"sap/ui/core/mvc/Controller","sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/BusyIndicator",
"sap/ui/model/Filter", "sap/ui/model/json/JSONModel", 
  "sap/ui/core/ValueState", "sap/ui/model/FilterOperator"
], function(Controller,MessageToast, MessageBox, BusyIndicator, Filter, JSONModel,   ValueState, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.activityConfirmation.controller.homeView", {
		
		
		
		
		
			onInit: function () {
			
			this.oModel = this.getOwnerComponent().getModel();
		//	var e = sap.ui.core.UIComponent.getRouterFor(this);
		//	e.getRoute("RouteView1").attachMatched(this._onRouteFound, this);
			var t = this.getView();
				
					var n = "0030";
						var V = "1000082";
				var b = this;
					var p = {};
				var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
				b.oModel.read(I, {
					success: function (oData) {
						p = oData;
						// if (oData.Gv_msg1 !== "") {
						// 	MessageBox.error(oData.Gv_msg1);
						// 	return;
						// }
				
						var i = oData.Igmng;
						var s = oData.Gmein;
						
					
						
			sap.ui.getCore().byId("idOrder1").setText(V);
			sap.ui.getCore().byId("idOper1").setText(n);
			sap.ui.getCore().byId("idWork1").setText(oData.Arbpl);
			sap.ui.getCore().byId("idDesc1").setText(oData.Ktext);
			sap.ui.getCore().byId("idMat1").setText(oData.Matnr);
			sap.ui.getCore().byId("idMatD1").setText(oData.Maktx);
						
						
						if (i === "") {
							s = "";
						}
			
						
							sap.ui.getCore().byId("idQact1").setText(oData.ZactDate);
			sap.ui.getCore().byId("idATime1").setText(oData.ZactTime);
			sap.ui.getCore().byId("idAStat1").setText(oData.ZactPro);
			sap.ui.getCore().byId("idAUnit1").setText(oData.ZactStart);
						
					
					},
					error: function (e) {}
				});
		//	}
			
			this.fActClick();
		},
		
			fActClick: function (e) {
			
			//odata fetching logic
			
			
			
			var t = this.getView();
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("com.sap.activityConfirmation.fragments.act", this);
				this.getView().addDependent(this._oDialog1);
			}

			this._oDialog1.open();
		},
		
		// code for pop up close and cross navigation
			closeDialog: function (e) {
			if (this._oDialog1) {
				this._oDialog1.close();
			}
			
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM_12748",
					action: "display"
				}
			
			});
			
		},
		
		//  code to get value help "Reason for deviation"
				onReasonF4: function () {
			
	
			var e = sap.ui.getCore().byId("idOrder1").getText();
			BusyIndicator.show();
			if (!this._ReasonDialog) {
				this._ReasonDialog = sap.ui.xmlfragment("com.sap.activityConfirmation.fragments.value", this);
			}
		//	var t = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
		
		var oModel=	this.oModel;
			oModel.read("/GET_REASONSet", {
				filters: [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, e)],
				urlParameters: {
					$expand: "F4ReasonNav"
				},
				success: function (oData, t) {
					BusyIndicator.hide();
					var a = new sap.ui.model.json.JSONModel(oData.results[0].F4ReasonNav);
					this._ReasonDialog.setModel(a, "oReasonModel");
				}.bind(this),
				error: function (e) {
					BusyIndicator.hide();
				}.bind(this)
			});
			this._ReasonDialog.open();
		},
		//code to select a specific reason for deviation from value help
				onReasonF4Confirm: function (e) {
			
			var t = e.getParameter("selectedItem");
			sap.ui.getCore().byId("idReason1").setValue(t.getTitle());
			sap.ui.getCore().byId("idReason1").setDescription(t.getInfo());
		}

	});
});