sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Dialog1",
	"./utilities",
	"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel"
], function(BaseController, MessageBox, Dialog1, Utilities, History,JSONModel) {
	"use strict";
	var flag = false;
var oBusydialog = new sap.m.BusyDialog();
	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.Page1", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5d0b393df92df5011bbeac37";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onFioriListReportTableUpdateFinished: function(oEvent) {
			var oTable = oEvent.getSource();
			oTable._getSelectAllCheckbox().setVisible(false);
			var oHeaderbar = oTable.getAggregation();
			if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
				var oTitle = oHeaderbar.getAggregation("content")[1];
				if (oTable.getBinding("rows") && oTable.getBinding("rows").isLengthFinal()) {
					oTitle.setText("(" + oTable.getBinding("rows").getLength() + ")");
				} else {
					oTitle.setText("(1)");
				}
			}

		},
		_onFioriListReportUrlColumnPress: function(oEvent) {

			var sDialogName = "Dialog1";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog1(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			//var context = oEvent.getSource().getBindingContext();
			var context = oEvent.getSource().getParent().getBindingContext("initdata").getObject();
		//	oDialog.setBindingContext(context);
		//	oDialog.setBindingContext(context);
		var jsonModel = new JSONModel();
		jsonModel.setData(context);
		oDialog._oControl.setModel(jsonModel);
			oDialog.open();

		},
			clearAllFilters : function(oEvent){
					oBusydialog.open();
                             var that  = this;
				var modelA = this.getView().getModel();
				var oTable = this.getView().byId("po");
				var filterPressed = "Remove Filter";
				/*modelA.create("/zopenpoSet",filterPressed,{
					sucess:function(x,y){
						alert(x.results.length);
					},
					error:function(oError){
						alert(oError);
					}	
				});
					*/
				modelA.callFunction("/displayall",{
					method:"GET",
					urlParameters:{
						Filter1:"X"
					},
					success:function(x,y){
						flag = true;
					 var oOpenPOModel =  new JSONModel();
                oOpenPOModel.setSizeLimit(x.results.length+100);
                oOpenPOModel.setData(x.results);
               // var oTable = that.getView().byId("po");
               // that.getView().setModel(oOpenPOModel, "om");
               // oTable.setVisible(false);
                that.getView().setModel(oOpenPOModel, "initdata");
                 	oBusydialog.close();
					/*var service = "/sap/opu/odata/sap/ZOPENPO2_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(service,false);
					oTable.setModel(oModel);
					oTable.bindRows("/x");*/
               
              
            
			         /*oTable.setModel("modelA");
                     modelA.refresh(true);
                     oTable.bindRows("/x", null, null);*/
                    
			            
						
					},
					error:function(){
						
					}
				});
				
			},
			onAfterRendering: function(){
				var that = this;
				var jModel = this.getView().getModel();
				oBusydialog.open();
				jModel.read("/zopenpoSet",{success:function(data){
					debugger;
					var jsModel = new JSONModel();
					jsModel.setData(data.results);
					that.getView().setModel(jsModel,"initdata");
					
				},
				error:function(){
					
				}});
				oBusydialog.close();
			},
	
			
	

		closepo: function() {
			oBusydialog.open();
			var index = this.getView().byId("po").getSelectedIndices();
			if(index.length=== 0)
			{
				MessageBox.alert("Select atleast one PO to close");
				oBusydialog.close();
					return;
			}
		
		
			var pos = [];
			for (var j = 0; j < index.length; j++) {
				pos.push(this.getView().byId("po").getContextByIndex(index[j]));
			}
			
			// var pos =	this.getView().byId("po").getContextByIndex(index);
			var oEntry = [];
			var oModel = this.getOwnerComponent().getModel();
			//oModel.setUseBatch(true);
			oModel.setDeferredGroups(["POs"]);
			oBusydialog.open();
			for (var i = 0; i < pos.length; i++) {
				var oRow = {
					'd': {}
				};

				var oSelectedValues = this.getView().byId("po").getModel("initdata").getProperty(pos[i].getPath());
				oRow.d.Ebeln = oSelectedValues.Ebeln;
				oRow.d.Ebelp = oSelectedValues.Ebelp;
				oRow.d.Lifnr = oSelectedValues.Lifnr;
				oRow.d.Name1 = oSelectedValues.Name1;
				oRow.d.Txz01 = oSelectedValues.Txz01;
				oRow.d.Menge = oSelectedValues.Menge;
				oRow.d.Wemng = oSelectedValues.Wemng;
				oRow.d.Openq = oSelectedValues.Openq;
				oRow.d.Meins = oSelectedValues.Meins;
				oRow.d.Flag = oSelectedValues.Flag;
				// oEntry.push(oRow);
				oModel.create("/zopenpoSet", oRow, {
					groupId: "POs",
				success: function (oData, oResponse) {
					if (oResponse.headers["sap-message"] === undefined) {
						return;
					}
					var responseText = JSON.parse(oResponse.headers["sap-message"]).message;
					var length = JSON.parse(oResponse.headers["sap-message"]).details.length;
					if (length > 0) {
						for (var i = 0; i < length; i++) {
							var responseText2 = JSON.parse(oResponse.headers["sap-message"]).details[i].message;
							responseText = responseText + "\n" + responseText2;
						}
					}

					if (responseText === null || responseText === "" || responseText === undefined) {
						responseText = "Please contact your system administrator";
					}
					
					MessageBox.show(responseText, {
						icon: sap.m.MessageBox.Icon.NONE,
						title: "Message",
						actions: sap.m.MessageBox.Action.OK,
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					oBusydialog.close();
				},
		error: jQuery.proxy(function (error) {
					var errortext = JSON.parse(error.responseText).error.message.value;
					MessageBox.show(
						errortext, {
							icon: MessageBox.Icon.ERROR,
							title: "Error"
						});
					oBusydialog.close();
				})
			});
		}
            var that = this;
            //oBusydialog.open();
			oModel.submitChanges({
				groupId: "POs",
				success: function(x) {
					if(flag){
						//functionImport
						that.clearAllFilters();
					//	oBusydialog.close();
					}else{
						//oninit
						that.onAfterRendering();
						
					//	oBusydialog.close();
					}
					
					// oModel.refresh(true);
					 that.getView().byId("po").setSelectedIndex(-1);
				},
				error: function() {

				}
				
			
			});
		

		},
		closepo1: function() {
			var pos = this.getView().byId("po").getSelectedContexts();
			var oEntry = [];
			var oModel = this.getOwnerComponent().getModel();
			//oModel.setUseBatch(true);
			oModel.setDeferredGroups(["POs"]);
			for (var i = 0; i < pos.length; i++) {
				var oRow = {
					'd': {}
				};

				var oSelectedValues = this.getView().byId("po").getModel().getProperty(pos[i].getPath());
				oRow.d.Ebeln = oSelectedValues.Ebeln;
				oRow.d.Ebelp = oSelectedValues.Ebelp;
				oRow.d.Lifnr = oSelectedValues.Lifnr;
				oRow.d.Name1 = oSelectedValues.Name1;
				oRow.d.Txz01 = oSelectedValues.Txz01;
				oRow.d.Menge = oSelectedValues.Menge;
				oRow.d.Wemng = oSelectedValues.Wemng;
				oRow.d.Openq = oSelectedValues.Openq;
				oRow.d.Meins = oSelectedValues.Meins;
				oRow.d.Flag = oSelectedValues.Flag;
				//oEntry.push(oRow);
				oModel.create("/zopenpoSet", oRow, {
					groupId: "POs"
				});
			}

			oModel.submitChanges({
				groupId: "POs",
				success: function() {
					oModel.refresh(true);
				},
				error: function() {}
			});

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ListReport_ListReport_0-filterBars-Fiori_ListReport_FilterBar-1-filters-Fiori_ListReport_ComboBoxFilter-1560946113787---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_ListReport_ListReport_0-content-Fiori_ListReport_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);