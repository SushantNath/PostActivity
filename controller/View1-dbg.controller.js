var gmsgbundle;
var iOrder;
var iOper;
var vmsg;
var order;
var oper;
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/BusyIndicator",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/library",
	    "sap/ui/core/Core",
	    'sap/ui/core/Fragment',
	    'sap/m/Token',
	    "sap/ui/core/ValueState",
	    'sap/ui/model/FilterOperator'
	],
	function(Controller, MessageToast, MessageBox, BusyIndicator, History, Filter, JSONModel, library, Core, Fragment, Token, ValueState, FilterOperator) {
		"use strict";

	return Controller.extend("ZPROD_CONF1.controller.View1", {
		onAfterRendering: function() {
			// Accessing i18n Texts
				gmsgbundle = this.getView().getModel("i18n").getResourceBundle();
		},
		
		_data : {
			"date" : new Date()
		},
	
		onInit: function() {
			    
			    this.oModel = this.getOwnerComponent().getModel();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("RouteView1").attachMatched(this._onRouteFound, this);
				var oView = this.getView();
				oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
		
				}
				}, oView);
				var sRootPath = jQuery.sap.getModulePath("ZPROD_CONF1");
	            var oModel = new sap.ui.model.json.JSONModel([sRootPath, "model/Data.json"].join("/"));
                this.getView().setModel(oModel, "jData");
                // Reciving Production order information from another app(Manage Production operation)
                var query = window.location;
                console.log(query);
                var vhref = location.href;
                var vcheck = vhref.includes("&");
                if (vcheck === true)
                {
                var vlink = vhref.split("&");
                var vnum = vlink[2].split("=");
                var voper = vnum[1];
                var vorder = vlink[3].split("=");
                var vord = vorder[1];
                
                var that = this;
				// Passing values to back end
				var odetails = {};
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var rString = "/PO_GETSet(Aufnr='" + vord + "',Vornr='" + voper + "')";
                
				//Adding service to the odata model
				that.oModel.read(rString, {
					success: function(oData) {
						odetails = oData;
						if (oData.Gv_msg1 !== '')
						{
						MessageBox.error(oData.Gv_msg1);
		            	return;
						}
						
					    // Displaying values on screen	
					    that.getView().byId("idOrder").setValue(vord);
				        that.getView().byId("idOper").setValue(voper);
					    that.getView().byId("idNumber").setValue(oData.ANZMA);
						that.getView().byId("idWork").setValue(oData.Arbpl);
		            	that.getView().byId("idDesc").setValue(oData.Ktext);
			            that.getView().byId("idMat").setValue(oData.Matnr);
			            that.getView().byId("idMatD").setValue(oData.Maktx);
			            that.getView().byId("idQuan").setValue(oData.Gamng);
			            that.getView().byId("idQU").setValue(oData.Gmein);
			            that.getView().byId("idQConf").setValue(oData.Igmng);
			             // If Qty is empty then hiding UOM on screen
			            var Qcon = oData.Igmng;
			            var QUn  = oData.Gmein;
			            if ( Qcon === "" )
			            {
			            	QUn = "";
			            }
			            that.getView().byId("idQCon").setValue(QUn);
			            that.getView().byId("idQact").setValue(oData.ZactDate);
			            that.getView().byId("idATime").setValue(oData.ZactTime);
			            that.getView().byId("idAStat").setValue(oData.ZactPro);
			            that.getView().byId("idAUnit").setValue(oData.ZactStart);
			            that.getView().byId("idLast").setValue(oData.ZquanDate);
			            that.getView().byId("idQTime").setValue(oData.ZquanTime);
			            that.getView().byId("idQStat").setValue(oData.ZquanPro);
			            that.getView().byId("idQUnit").setValue(oData.ZquanUnit);
			            
			            // Getting values from back end
						var oModeldel = new sap.ui.model.json.JSONModel(odetails);
						sap.ui.getCore().setModel(oModeldel, "Idetails");
						oRouter.navTo("RouteView1");
			            },
					error: function(e) {

					}
				});
                }
		},
              
           // F4 help for Reason	
	      onReasonF4: function() {
	      	var vOrder = this.getView().byId("idOrder").getValue();
            
         BusyIndicator.show(10);
				if (!this._ReasonDialog) {
					this._ReasonDialog = sap.ui.xmlfragment("ZPROD_CONF1.fragments.value", this);
				}
				
                //Adding service to the odata model
				    var oModelReason = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
			     	oModelReason.read("/GET_REASONSet", {
			     	filters: [
					new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, vOrder),
					],
					urlParameters: {
						$expand: "F4ReasonNav"
					},
					success: function(oData, oResponse) {
                    BusyIndicator.hide();
						var oReasonModel = new sap.ui.model.json.JSONModel(oData.results[0].F4ReasonNav);
						this._ReasonDialog.setModel(oReasonModel, "oReasonModel");
					}.bind(this),
					error: function(oError) {
						BusyIndicator.hide();
					}.bind(this)
				});
				
				this._ReasonDialog.open();
			},
		
			
			//Reason F4 Search
			onReasonF4Search: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter([new Filter("Grund", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Grdtx", sap.ui.model.FilterOperator.Contains, sValue)
				]);
				var oFilter2 = new sap.ui.model.Filter(oFilter, false);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter([oFilter2]);
			},
	
			//Reason F4 Confirm
			onReasonF4Confirm: function(oEvent) {
				var selectedReason = oEvent.getParameter("selectedItem"); 
				sap.ui.getCore().byId("idReason1").setValue(selectedReason.getTitle());
				sap.ui.getCore().byId("idReason1").setDescription(selectedReason.getInfo());
			},
	    onReasonF4Change: function(){
	    
			var vreason = this.getView().byId("idReason1").getValue();
	    	    vreason = vreason.toUpperCase();	
	            sap.ui.getCore().byId("idReason1").setValue(vreason);
	        },
	        
		fQuantityClick: function (oEvent) {
				var oView = this.getView();
                
				if (!this._oDialog2) {
					
					this._oDialog2 = sap.ui.xmlfragment("ZPROD_CONF1.fragments.quan", this);
					this.getView().addDependent(this._oDialog2);
					
				}
                var oModel = new JSONModel();
			    oModel.setData({
				dateValue: new Date()
			    });
			    sap.ui.getCore().byId("idQuan2").setValue("");
			    sap.ui.getCore().byId("idNumber2").setValue("");
			    this.getView().setModel(oModel);
			    sap.ui.getCore().byId("idDate2").setDateValue(new Date());
			    sap.ui.getCore().byId("idTime2").setDateValue(new Date());
			
			
				// Getting values from screen	
                iOrder    = this.getView().byId("idOrder").getValue();
				iOper     = this.getView().byId("idOper").getValue(); 
				var Work  = this.getView().byId("idWork").getValue();
		        var Desc  = this.getView().byId("idDesc").getValue();
			    var Mat   = this.getView().byId("idMat").getValue();
			    var MatD  = this.getView().byId("idMatD").getValue();
  			    var Last  = this.getView().byId("idLast").getValue();
                var QTime = this.getView().byId("idQTime").getValue();
                var QStat = this.getView().byId("idQStat").getValue();
                var QUnit = this.getView().byId("idQUnit").getValue();
                var ANum  = this.getView().byId("idNumber").getValue();
                var Unit  = this.getView().byId("idQCon").getValue();
                if ( Unit === "PC")
                {
                	Unit = "PAL";
                }
                var Type  = oEvent.getSource().getText();
			    
			   // Displaying values on popup
				 sap.ui.getCore().byId("idOrder2").setValue(iOrder);
				 sap.ui.getCore().byId("idOper2").setValue(iOper);
				 sap.ui.getCore().byId("idWork2").setValue(Work);
				 sap.ui.getCore().byId("idDesc2").setValue(Desc);
				 sap.ui.getCore().byId("idMat2").setValue(Mat);
				 sap.ui.getCore().byId("idMatD2").setValue(MatD);
				 sap.ui.getCore().byId("idLast2").setValue(Last);
				 sap.ui.getCore().byId("idQTime2").setValue(QTime);
				 sap.ui.getCore().byId("idQStat2").setValue(QStat);
				 sap.ui.getCore().byId("idQUnit2").setValue(QUnit);
				 sap.ui.getCore().byId("idType2").setValue(Type);
				 sap.ui.getCore().byId("idQU2").setValue(Unit);
				 
				 this._oDialog2.open();
			
				
		    },

			fHandleClose1: function (oEvent) {
			/* This function closes the dialog box */
			if (this._oDialog1) {
				this._oDialog1.close();
				}
		    },
		
			fHandleClose2: function (oEvent) {
			/* This function closes the dialog box */
			if (this._oDialog2) {
				this._oDialog2.close();
				}
		    },
        
   
		fActClick: function (oEvent) {
			    var oView = this.getView();
                
				if (!this._oDialog1) {
					
					this._oDialog1 = sap.ui.xmlfragment("ZPROD_CONF1.fragments.act", this);
					this.getView().addDependent(this._oDialog1);
				}
				sap.ui.getCore().byId("idReason1").setValue("");
				sap.ui.getCore().byId("idReason1").setDescription("");
				sap.ui.getCore().byId("idNumber1").setValue("");
				var sRootPath = jQuery.sap.getModulePath("ZPROD_CONF1");
	            var oModel = new sap.ui.model.json.JSONModel([sRootPath, "model/Data.json"].join("/"));
                this.getView().setModel(oModel, "jData");
             
                var oModel = new JSONModel();
			    oModel.setData({
				dateValue: new Date()
			    });
			    
			   
			    this.getView().setModel(oModel);
			    sap.ui.getCore().byId("idDate1").setDateValue(new Date());
			    sap.ui.getCore().byId("idTime1").setDateValue(new Date());
			   
                 // Getting values from screen	
                iOrder    = this.getView().byId("idOrder").getValue();
				iOper     = this.getView().byId("idOper").getValue(); 
				var Work  = this.getView().byId("idWork").getValue();
		        var Desc  = this.getView().byId("idDesc").getValue();
			    var Mat   = this.getView().byId("idMat").getValue();
			    var MatD  = this.getView().byId("idMatD").getValue();
  			    var Qact  = this.getView().byId("idQact").getValue();
			    var ATime = this.getView().byId("idATime").getValue();
			    var AStat = this.getView().byId("idAStat").getValue();
			    var AUnit = this.getView().byId("idAUnit").getValue();
			    var ANum  = this.getView().byId("idNumber").getValue();
			    var Type  = oEvent.getSource().getText();
			    
			     if ( (Type === "Start Set-up") || (Type === "Start Processing") )
			     {
			     sap.ui.getCore().byId("idNumber1").setVisible(false);
			     sap.ui.getCore().byId("idLNumber1").setVisible(false);
			     }
			     else
			     {
			     sap.ui.getCore().byId("idNumber1").setVisible(true);
			     sap.ui.getCore().byId("idLNumber1").setVisible(true);	
			     }
			   
			   // Displaying values on popup
				 sap.ui.getCore().byId("idOrder1").setValue(iOrder);
				 sap.ui.getCore().byId("idOper1").setValue(iOper);
				 sap.ui.getCore().byId("idWork1").setValue(Work);
				 sap.ui.getCore().byId("idDesc1").setValue(Desc);
				 sap.ui.getCore().byId("idMat1").setValue(Mat);
				 sap.ui.getCore().byId("idMatD1").setValue(MatD);
				 sap.ui.getCore().byId("idQact1").setValue(Qact);
				 sap.ui.getCore().byId("idATime1").setValue(ATime);
				 sap.ui.getCore().byId("idAStat1").setValue(AStat);
				 sap.ui.getCore().byId("idAUnit1").setValue(AUnit);
				 sap.ui.getCore().byId("idType1").setValue(Type);
				 
		    	 this._oDialog1.open();
	
		},
    		
            
			fConfirm1: function (oEvent) {
			/* This function confirm the production order */
			
			if (this._oDialog1) {
			var that   = this;
			var iOrd   = sap.ui.getCore().byId("idOrder1").getValue();
            var iOpe   = sap.ui.getCore().byId("idOper1").getValue();	
            var iType  = sap.ui.getCore().byId("idType1").getValue();
            var iDate  = sap.ui.getCore().byId("idDate1").getValue();
            var iTime  = sap.ui.getCore().byId("idTime1").getValue();
            var iReason  = sap.ui.getCore().byId("idReason1").getValue();
            var iNum    = sap.ui.getCore().byId("idNumber1").getValue();
            var iQty = "";
            var iUnit = "";
            // To stop confirming the activity if number of perators is empty
            if ( ( iType === "Partial End Set-up" ) || ( iType === "Interrupt Set-up" ) ||
                 ( iType === "End Set-up" ) || ( iType === "Partial End Processing" ) ||
                 ( iType === "Interrupt Processing" ) || ( iType === "End Processing" ) )
            
            {
            if ( ( iNum === "" ) || ( iNum === "0" ) )
            {
            MessageBox.error("Please insert a number of operators");
			return;	
            }
            }
            else
            {
            iNum = "";	
            }
            
          
            // Passing values to back end
				var odetails = {};
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
				var rString = "/PO_CONFSet(Order='" + iOrd + "',Reason='" + iReason + "',Number='" + iNum + "',Operation='" + iOpe + "',Record='" + iType + "',Logdate='" + iDate + "',Logtime='" + iTime + "',Unit='" + iUnit + "',Yield='" + iQty + "')";
                var vtitle = gmsgbundle.getText("Message");
				//Adding service to the odata model
						oModel.read(rString, null, null, false, function(oData) {
			        	odetails = oData;
			            vmsg = odetails.GvMsg;
			             MessageBox.show(
							vmsg, {
								title: vtitle,
								actions: [sap.m.MessageBox.Action.CLOSE], //					              
								onClose: function (oAction) {
									// Go to initial screen
						if (oData.GvFlag === '')
			        	{
				        that._oDialog1.close();
				        var rString = "/PO_GETSet(Aufnr='" + iOrd + "',Vornr='" + iOpe + "')";
                        var vtitle = gmsgbundle.getText("Title");
				        //Adding service to the odata model
				        that.oModel.read(rString, {
					    success: function(oData) {
						odetails = oData;
						if (oData.Gv_msg1 !== '')
						{
						MessageBox.error(oData.Gv_msg1);
		            	return;
						}
						
					    // Displaying values on screen	
					    that.getView().byId("idNumber").setValue(oData.ANZMA);
						that.getView().byId("idWork").setValue(oData.Arbpl);
		            	that.getView().byId("idDesc").setValue(oData.Ktext);
			            that.getView().byId("idMat").setValue(oData.Matnr);
			            that.getView().byId("idMatD").setValue(oData.Maktx);
			            that.getView().byId("idQuan").setValue(oData.Gamng);
			            that.getView().byId("idQU").setValue(oData.Gmein);
			            that.getView().byId("idQConf").setValue(oData.Igmng);
			             // If Qty is empty then hiding UOM on screen
			            var Qcon = oData.Igmng;
			            var QUn  = oData.Gmein;
			            if ( Qcon === "" )
			            {
			            	QUn = "";
			            }
			            that.getView().byId("idQCon").setValue(QUn);
			            that.getView().byId("idQact").setValue(oData.ZactDate);
			            that.getView().byId("idATime").setValue(oData.ZactTime);
			            that.getView().byId("idAStat").setValue(oData.ZactPro);
			            that.getView().byId("idAUnit").setValue(oData.ZactStart);

			            // Getting values from back end
						var oModeldel = new sap.ui.model.json.JSONModel(odetails);
						sap.ui.getCore().setModel(oModeldel, "Idetails");
						oRouter.navTo("RouteView1");
			            },
				     	error: function(e) {

					    }
			     	    });
			        	}
						oRouter.navTo("RouteView1");
						}
           			    }
						);
			  
			           });
			           }
			           },
			 
			 fConfirm2: function (oEvent) {
			/* This function confirm the production order */
			
			if (this._oDialog2) {
			var that   = this;
			var iOrd   = sap.ui.getCore().byId("idOrder2").getValue();
            var iOpe   = sap.ui.getCore().byId("idOper2").getValue();	
            var iType  = sap.ui.getCore().byId("idType2").getValue();
            var iDate  = sap.ui.getCore().byId("idDate2").getValue();
            var iTime  = sap.ui.getCore().byId("idTime2").getValue();
            var iQty    = sap.ui.getCore().byId("idQuan2").getValue();
			var iUnit   = sap.ui.getCore().byId("idQU2").getValue();
			var iNum    = sap.ui.getCore().byId("idNumber2").getValue();
            var iReason = ""; 
          
          
           // To stop confirming the activity if number of perators is empty 
            if ( ( iNum === "" ) || ( iNum === "0" ) )
            {
            MessageBox.error("Please insert a number of operators");
			return;	
            }
            
            
            // Passing values to back end
				var odetails = {};
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
				var rString = "/PO_CONFSet(Order='" + iOrd + "',Operation='" + iOpe + "',Reason='" + iReason + "',Number='" + iNum + "',Record='" + iType + "',Logdate='" + iDate + "',Logtime='" + iTime + "',Unit='" + iUnit + "',Yield='" + iQty + "')";
                var vtitle = gmsgbundle.getText("Message");
				//Adding service to the odata model
						oModel.read(rString, null, null, false, function(oData) {
			        	odetails = oData;
			            vmsg = odetails.GvMsg;
			             MessageBox.show(
							vmsg, {
								title: vtitle,
								actions: [sap.m.MessageBox.Action.CLOSE], //					              
								onClose: function (oAction) {
									// Go to initial screen
						if (oData.GvFlag === '')
			        	{
			            // Calling Post consumption App
				        var iman = sap.ui.getCore().byId("idManual2").getValue();
				        if (iman == "X")
				        {
				         sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				         target: {
					     semanticObject: "ZpostCons_semobj",
					     action: "display"
				        },
				        params: {
					    "Warehouse": "4A10",
					    "ManufacturingOrder": iOrd,
					    "Operation": iOpe,
					    "Quantity": iQty,
                        "Unit": iUnit,
					    "mode": "crossNavigation"
				        }
		    	       });
				       }
				      //
				        that._oDialog2.close();
				        var rString = "/PO_GETSet(Aufnr='" + iOrd + "',Vornr='" + iOpe + "')";
                        var vtitle = gmsgbundle.getText("Title");
				        //Adding service to the odata model
				        that.oModel.read(rString, {
					    success: function(oData) {
						odetails = oData;
						if (oData.Gv_msg1 !== '')
						{
						MessageBox.error(oData.Gv_msg1);
		            	return;
						}
						
					    // Displaying values on screen	
					    that.getView().byId("idNumber").setValue(oData.ANZMA);
						that.getView().byId("idWork").setValue(oData.Arbpl);
		            	that.getView().byId("idDesc").setValue(oData.Ktext);
			            that.getView().byId("idMat").setValue(oData.Matnr);
			            that.getView().byId("idMatD").setValue(oData.Maktx);
			            that.getView().byId("idQuan").setValue(oData.Gamng);
			            that.getView().byId("idQU").setValue(oData.Gmein);
			            that.getView().byId("idQConf").setValue(oData.Igmng);
			             // If Qty is empty then hiding UOM on screen
			            var Qcon = oData.Igmng;
			            var QUn  = oData.Gmein;
			            if ( Qcon === "" )
			            {
			            	QUn = "";
			            }
			            that.getView().byId("idQCon").setValue(QUn);
			            that.getView().byId("idLast").setValue(oData.ZquanDate);
			            that.getView().byId("idQTime").setValue(oData.ZquanTime);
			            that.getView().byId("idQStat").setValue(oData.ZquanPro);
			            that.getView().byId("idQUnit").setValue(oData.ZquanUnit);
			            
			            
			            // Getting values from back end
						var oModeldel = new sap.ui.model.json.JSONModel(odetails);
						sap.ui.getCore().setModel(oModeldel, "Idetails");
						oRouter.navTo("RouteView1");
			            },
					error: function(e) {

					}
			     	});
			        	}
						oRouter.navTo("RouteView1");
						}
           			    }
						);
			  
			           });
			           }
			           },          
		
			_onRouteFound: function(oEvt) {
   
			},
			

				fSaveResults: function() {   
				var that = this;
				// Getting Order and operation 
				 iOrder = this.getView().byId("idOrder").getValue();
				 iOper = this.getView().byId("idOper").getValue();
				
				// Passing values to back end
				var odetails = {};
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var rString = "/PO_GETSet(Aufnr='" + iOrder + "',Vornr='" + iOper + "')";
                var vtitle = gmsgbundle.getText("Title");
				//Adding service to the odata model
				that.oModel.read(rString, {
					success: function(oData) {
						odetails = oData;
						if (oData.Gv_msg1 !== '')
						{
						MessageBox.error(oData.Gv_msg1);
		            	return;
						}
						
					    // Displaying values on screen	
					    that.getView().byId("idNumber").setValue(oData.ANZMA);
						that.getView().byId("idWork").setValue(oData.Arbpl);
		            	that.getView().byId("idDesc").setValue(oData.Ktext);
			            that.getView().byId("idMat").setValue(oData.Matnr);
			            that.getView().byId("idMatD").setValue(oData.Maktx);
			            that.getView().byId("idQuan").setValue(oData.Gamng);
			            that.getView().byId("idQU").setValue(oData.Gmein);
			            that.getView().byId("idQConf").setValue(oData.Igmng);
			            // If Qty is empty then hiding UOM on screen
			            var Qcon = oData.Igmng;
			            var QUn  = oData.Gmein;
			            if ( Qcon === "" )
			            {
			            	QUn = "";
			            }
			            that.getView().byId("idQCon").setValue(QUn);
			            that.getView().byId("idQact").setValue(oData.ZactDate);
			            that.getView().byId("idATime").setValue(oData.ZactTime);
			            that.getView().byId("idAStat").setValue(oData.ZactPro);
			            that.getView().byId("idAUnit").setValue(oData.ZactStart);
			            that.getView().byId("idLast").setValue(oData.ZquanDate);
			            that.getView().byId("idQTime").setValue(oData.ZquanTime);
			            that.getView().byId("idQStat").setValue(oData.ZquanPro);
			            that.getView().byId("idQUnit").setValue(oData.ZquanUnit);
			            
			            
			            // Getting values from back end
						var oModeldel = new sap.ui.model.json.JSONModel(odetails);
						sap.ui.getCore().setModel(oModeldel, "Idetails");
						oRouter.navTo("RouteView1");
			            },
					error: function(e) {

					}
				});
			},
	
			fchangetype1 : function(e) {
		    var vtype = this.getView().byId("idReason1").getSelectedKey();
			if (vtype !== '')
			{
			var oType = vtype;
			oType = oType;
			}
			},
				fBack: function (evt) {
              // back to main screen
		    	var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			    oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "#"
				}
			});

		}

		});

	});