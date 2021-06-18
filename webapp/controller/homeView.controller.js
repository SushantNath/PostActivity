var gmsgbundle;

sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter", "sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState", "sap/ui/model/FilterOperator"
], function(Controller, MessageToast, MessageBox, BusyIndicator, Filter, JSONModel, ValueState, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.activityConfirmation.controller.homeView", {

		onInit: function() {

			var ParameterData = this.getOwnerComponent().getComponentData();
				gmsgbundle = this.getOwnerComponent().getModel("i18n");

			var processField;
			var startField;
			var reasonField;
			var confirmationField;
			var that = this;
			//Activity information for for Last Activity blank

			var oActivityBlank = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
						
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Setup Start

			var oActivitySetupStart = {
				activity: [{
						actId: "R40",
						activityDes: "End Setup"
					}

				]
			};

			//Activity information for for Last Activity Setup End

			var oActivitySetupEnd = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing Start

			var oActivityProcessStart = {
				activity: [{
					 
						actId: "B20",
						activityDes: "End Failure"
					},
					{
					 
						actId: "B40",
						activityDes: "End Processing"
					}

				]
			};
			
				//Activity information for for Last Activity Processing Start blank

			var oActivityProcessStartBlank = {
				activity: [{
					 
						actId: "B20",
						activityDes: "Start Failure"
					},
					{
					 
						actId: "B30",
						activityDes: "Interrupt Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing Partial Blank

			var oActivityProcessPartialBlank = {
				activity: [{
						actId: "B20",
						activityDes: "Start Failure"
					},  {
						actId: "B30",
						activityDes: "Interrupt Processing"
					}, {
						actId: "B40",
						activityDes: "End Processing"
					}

				]
			};
			
				//Activity information for for Last Activity Processing Partial 

			var oActivityProcessPartial = {
				activity: [	{
						actId: "B20",
						activityDes: "End Failure"
					}

				]
			};
			
			
			
			
		

			//Activity information for for Last Activity Processing Interrupt

			var oActivityProcessInterrupt = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing End

			var oActivityProcessEnd = {
				activity: [{
						actId: "R40",
						activityDes: "No further confirmation"
					}

				]
			};

			this.oModel = this.getOwnerComponent().getModel();
			//	var e = sap.ui.core.UIComponent.getRouterFor(this);
			//	e.getRoute("RouteView1").attachMatched(this._onRouteFound, this);

			// var oConfirmModel = new sap.ui.model.json.JSONModel(jQuery.sap.getModulePath("com.sap.activityConfirmation", "/Data.json"));
			//      this.getView().setModel(oConfirmModel, "confirmData");
			var n;
			var V;
			var that= this;
			var t = this.getView();
	           n = "0010";
				V = "1002183";
 
			if (ParameterData.startupParameters.orderNumber === undefined && ParameterData.startupParameters.operationNum === undefined){
 console.log("passed order number is undefined ");

				n = "0030";
				V = "1000082";
			} else {

 console.log("passed order number is ", ParameterData.startupParameters.orderType);
 console.log("passed operation number is ", ParameterData.startupParameters.operationNum);

			
			//////////////////////////////
				if (ParameterData.startupParameters.orderType) {

							V = ParameterData.startupParameters.orderType[0]; // “Getting the Purchase Order Value passed along with the URL
                            that.orderNumber= V;
						}

						if (ParameterData.startupParameters.operationNum) {

							n = ParameterData.startupParameters.operationNum[0]; // “Getting the Purchase Order Value passed along with the URL
                           that.operationNum = n;
						}
							if (ParameterData.startupParameters.intOper) {

						var	intOper = ParameterData.startupParameters.intOper[0]; // “Getting the Purchase Order Value passed along with the URL
                        that.iOper = intOper;
						}
							if (ParameterData.startupParameters.intOperItem) {

						var	intOperItem = ParameterData.startupParameters.intOperItem[0]; // “Getting the Purchase Order Value passed along with the URL
                                      that.iOperItem =   intOperItem ;
						}

					
				
			///////////////////////////////	

			}  

			var b = this;
			var p = {};
			var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
			b.oModel.read(I, {
				success: function(oData) {
					p = oData;
					// if (oData.Gv_msg1 !== "") {
					// 	MessageBox.error(oData.Gv_msg1);
					// 	return;
					// }

					var i = oData.Igmng;
					var s = oData.Gmein;

					sap.ui.getCore().byId("idDate1").setDateValue(new Date);
					sap.ui.getCore().byId("idTime1").setDateValue(new Date);
					sap.ui.getCore().byId("idOrder1").setValue(V);
					sap.ui.getCore().byId("idOper1").setValue(n);
					sap.ui.getCore().byId("idWork1").setValue(oData.Arbpl);
					sap.ui.getCore().byId("idDesc1").setValue(oData.Ktext);
					sap.ui.getCore().byId("idMat1").setValue(oData.Matnr);
					sap.ui.getCore().byId("idMatD1").setValue(oData.Maktx);

					if (i === "") {
						s = "";
					}

					sap.ui.getCore().byId("idQact1").setValue(oData.ZactDate);
					sap.ui.getCore().byId("idATime1").setValue(oData.ZactTime);
					sap.ui.getCore().byId("idAStat1").setValue(oData.ZactPro);
					sap.ui.getCore().byId("idAUnit1").setValue(oData.ZactStart);
					/*sap.ui.getCore().byId("idConf").setText(oData.Satza);
					sap.ui.getCore().byId("idReason").setText(oData.Grund);*/
					processField = oData.ZactPro;
					startField = oData.ZactStart;
					reasonField= oData.Grund;
					confirmationField= oData.Satza;
					
					console.log("Reason and confirmation field are", reasonField,confirmationField);

					if (reasonField === "0000" && confirmationField === "B10") { //Process start

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessStart);

					} 
				//	else if (reasonField === "N/A" && confirmationField === "N/A") { //Blank values
                     else if (reasonField === "" && confirmationField === "") { //Blank values
				
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityBlank);

					} else if (reasonField === "" && confirmationField === "R10") { //setup start

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivitySetupStart);

					}
				//	else if (reasonField === "N/A" && confirmationField === "R40") { //setup end
                     else if (reasonField === "" && confirmationField === "R40") { //setup end
					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivitySetupEnd);

					} else if (reasonField === "0000" && confirmationField === "B20") { //Processing partial

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessPartial);

					} 
				//	else if (reasonField === "N/A" && confirmationField === "B30") { //Process interrupt
                     	else if (reasonField === "" && confirmationField === "B30") { //Process interrupt
					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessInterrupt);

					} else if (reasonField === "" && confirmationField === "B40") { //process finish

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessEnd);
						
			var errorMessage = "Production order already finished.No further activity can be posted";
						
							MessageBox.error(errorMessage, {
						title: "Message",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (r) {
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				},
				
					params: {
						"orderType": t.orderNumber,
						"operationNum": t.operationNum,
						"mode": "crossNavigation",
							"intOper": t.iOper,
								"intOperItem":  t.iOperItem
						

					}

			});
					
						} 

					} );
					}
					else if (reasonField === "" && confirmationField === "B10") { //process start blank

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessStartBlank);

					} 
					else if (reasonField !== "0000" && confirmationField === "B20") { //process partial blank

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessPartialBlank);

					} 

					that.getView().setModel(that.oConfirmModel, "confirmData");
					var oDDL = sap.ui.getCore().byId("DropDown");
					var oDDLTemplate = new sap.ui.core.Item({
						key: "{confirmData>actId}",
						text: "{confirmData>activityDes}"
					});
					oDDL.setModel(that.oJson);
					oDDL.bindAggregation("items", "confirmData>/activity", oDDLTemplate);

				},
				error: function(e) {}
			});
			//	}

			this.fActClick();

		},

		fActClick: function(e) {

			//odata fetching logic

			var t = this.getView();
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("com.sap.activityConfirmation.fragments.act", this);
				this.getView().addDependent(this._oDialog1);
			}

			this._oDialog1.open();
		},

		// code for pop up close and cross navigation
		closeDialog: function(e) {
			var t=this;
			if (this._oDialog1) {
				this._oDialog1.close();
			}

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				},
					params: {
						"orderType": t.orderNumber,
						"operationNum": t.operationNum,
						"mode": "crossNavigation",
							"intOper": t.iOper,
								"intOperItem":  t.iOperItem
						

					}

			});

		},
		
		//code to handle change event for Confirmation type.
		changeConfirmation: function() {
		var confirmType	= sap.ui.getCore().byId("DropDown")._getSelectedItemText();
		// validation for "reason for deviation" based on "confirmation type"
		if(confirmType === "End Failure"){
			sap.ui.getCore().byId("idReason1").setEnabled(true);
		//	this.reasonMandatory="yes";
				sap.ui.getCore().byId("idReason1").setRequired(true);
		}
		else{
			sap.ui.getCore().byId("idReason1").setEnabled(false);	
				sap.ui.getCore().byId("idReason1").setRequired(false);
				
		
		}
		
		//Validation for "No. of operators" based on "confirmation type"
		
			if(confirmType === "Start Setup" || confirmType === "Start Processing"){
			sap.ui.getCore().byId("idNumber1").setEnabled(false);
				//	this.numberMandatory="yes";
				sap.ui.getCore().byId("idNumber1").setRequired(false);
		}
		else{
			sap.ui.getCore().byId("idNumber1").setEnabled(true);
			//	this.numberMandatory="no";
				sap.ui.getCore().byId("idNumber1").setRequired(true);
		}
		//set values to balnk on change of confirmation type
		sap.ui.getCore().byId("idReason1").setValue("");
		sap.ui.getCore().byId("idReason1").setDescription("");
		sap.ui.getCore().byId("commentsText").setValue("");	
		sap.ui.getCore().byId("idNumber1").setValue("");
		
		
		},

		//  code to get value help "Reason for deviation"
		onReasonF4: function() {

			var e = sap.ui.getCore().byId("idOrder1").getValue();
			BusyIndicator.show();
			if (!this._ReasonDialog) {
				this._ReasonDialog = sap.ui.xmlfragment("com.sap.activityConfirmation.fragments.value", this);
			}
			//	var t = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");

			var oModel = this.oModel;
			oModel.read("/GET_REASONSet", {
				filters: [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, e)],
				urlParameters: {
					$expand: "F4ReasonNav"
				},
				success: function(oData, t) {
					BusyIndicator.hide();
					var a = new sap.ui.model.json.JSONModel(oData.results[0].F4ReasonNav);
					this._ReasonDialog.setModel(a, "oReasonModel");
				}.bind(this),
				error: function(e) {
					BusyIndicator.hide();
				}.bind(this)
			});
			this._ReasonDialog.open();
		},
		//code to select a specific reason for deviation from value help
		onReasonF4Confirm: function(e) {

			var t = e.getParameter("selectedItem");
			sap.ui.getCore().byId("idReason1").setValue(t.getTitle());
			sap.ui.getCore().byId("idReason1").setDescription(t.getInfo());
		},
		
		//code for post activity/save functionality
			fConfirm1: function (e) {
	
				var t = this;
				var i = sap.ui.getCore().byId("idOrder1").getValue(); //Production order
				var s = sap.ui.getCore().byId("idOper1").getValue(); //Operation
			//	var r = sap.ui.getCore().byId("DropDown").getSelectedKey(); //Confirmation type
			var confValue =	sap.ui.getCore().byId("DropDown")._getSelectedItemText();//Confirmation type
			//sap.ui.getCore().byId("DropDown")._getSelectedItemText();//Confirmation type
			var r =	(confValue.replace(" ", "%20"));
				//sap.ui.getCore().byId("DropDown").getSelectedKey(); //Confirmation type
			 	var d = sap.ui.getCore().byId("idDate1").getValue();//Date
				var logTime = sap.ui.getCore().byId("idTime1").getValue();
				var logtime1= (logTime.replace(":", ""));
				var o= (logtime1.replace(":", "")); //time
			 	var g = sap.ui.getCore().byId("idNumber1").getValue(); //Number of operators
			 	var comments1 = sap.ui.getCore().byId("commentsText").getValue(); // Comments
			 	var comments2 = (comments1.replace(" ", "%20"));
			 	var comments3 = (comments2.replace(" ", "%20"));
			 	var comments = (comments3.replace(" ", "%20"));
			 	
			     var n = "";//Yield
				 var l = "";  //unit
			
			 //   this.numberMandatory="yes";
				var reasonValue=sap.ui.getCore().byId("idReason1").getValue();
				var reasonRequire=sap.ui.getCore().byId("idReason1").getRequired();
				var operatorValue= sap.ui.getCore().byId("idNumber1").getValue();
				var operatorRequire = sap.ui.getCore().byId("idNumber1").getRequired();
			//	sap.ui.getCore().byId("idLNumber1").setRequired(true);
				var u = reasonValue;//Reason for deviation
				
				if(d===""|| o=== ""){ //date and time
					MessageBox.error("Please fill in all required fileds to proceed");
					return;
					
				}
				
					if(reasonValue==="" && reasonRequire=== true){ //Reason label and field
					MessageBox.error("Please fill in all required fileds to proceed");
				//	sap.ui.getCore().byId("idReason1").setValueState(sap.ui.core.ValueState.Error);
						return;
				}
				
					if(operatorValue==="" && operatorRequire=== true){ //No. of operators
					MessageBox.error("Please fill in all required fileds to proceed");
				//	sap.ui.getCore().byId("idNumber1").setValueState(sap.ui.core.ValueState.Error);
						return;
				}
		        	if (g > 3 || g > "3") {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
		     
				var V = {};
				var vmsg;
				var b = sap.ui.core.UIComponent.getRouterFor(this);
				var p = this.getOwnerComponent().getModel();
					var y = ("Message");
			var I = "/PO_CONFSet(Order='" + i + "',Reason='" + u + "',Number='" + g + "',Operation='" + s + "',Record='" + r + "',Logdate='" +
					d + "',Logtime='" + o + "',Unit='" + l + "',Yield='" + n + "',Comments='" + comments + "')";
		//		var y = gmsgbundle.getText("Message");
				p.read(I, {
				//		p.read(I, null, null, false, function (e) {
					
						success: function (oData, Response) {

					
					console.log("Inside warehouse success function", oData.results);
				//	V = e;
					vmsg = Response.data.GvMsg;
					MessageBox.show(vmsg, {
						title: y,
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (r) {
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				},
					params: {
						"orderType": t.orderNumber,
						"operationNum": t.operationNum,
						"mode": "crossNavigation",
							"intOper": t.iOper,
								"intOperItem":  t.iOperItem
						

					}

			});
					
						} 
					});
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function first");
					MessageBox.show("Error in fetching records");                             
				}
					
				
				}) ;
		}

	});
});