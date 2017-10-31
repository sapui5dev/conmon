sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./EventList/utilities",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("fmg.conmon.controller.ItemCreation1", {
    handleRouteMatched: function (oEvent) {
            		
		var oParams = {}; 
		
		if (oEvent.mParameters.data.context) { 
		    this.sContext = oEvent.mParameters.data.context;
		    var oPath; 
		    if (this.sContext) { 
		        oPath = {path: "/" + this.sContext, parameters: oParams}; 
		        this.getView().bindObject(oPath);
		    } 
		}
		
		
		
        },
_onInputValueHelpRequest: function (oEvent) {
            		
		var sDialogName = "Dialog5";
		this.mDialogs = this.mDialogs || {};
		var oDialog = this.mDialogs[sDialogName];
		var oSource = oEvent.getSource();
		var oBindingContext = oSource.getBindingContext();
		var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
		var oView;
		if (!oDialog) {
		    this.getOwnerComponent().runAsOwner(function () {
		oView = sap.ui.xmlview({viewName: "fmg.conmon.view.EventList" + sDialogName});
		        this.getView().addDependent(oView);
		        oView.getController().setRouter(this.oRouter);
		        oDialog = oView.getContent()[0];
		        this.mDialogs[sDialogName] = oDialog;
		    }.bind(this));
		}
		
		return new Promise(function(fnResolve) {
		    oDialog.attachEventOnce("afterOpen", null, fnResolve);
		    oDialog.open();
		    if (oView) {
		        oDialog.attachAfterOpen(function () {
		            oDialog.rerender();
		        });
		    } else {
		        oView = oDialog.getParent();
		    }
		    
		    var oModel = this.getView().getModel();
		    if (oModel) {
		        oView.setModel(oModel);
		    } 
		    if (sPath) {
		        var oParams = oView.getController().getBindingParameters();
		        oView.bindObject({path: sPath, parameters: oParams});
		    }
		}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
		
        },
_onButtonPress: function (oEvent) {
            		
		oEvent = jQuery.extend(true, {}, oEvent);
		return new Promise(function (fnResolve) { fnResolve(true); })
		.then(function (result) {
		    var oView = this.getView();
		var oController = this;
		
		return new Promise(function (fnResolve, fnReject) {
		        var oModel = oController.oModel;
		        
		        var fnResetChangesAndReject = function (sMessage) {
		            oModel.resetChanges();
		            fnReject(new Error(sMessage));
		        };
		        if (oModel && oModel.hasPendingChanges()) {
		            oModel.submitChanges({
		                success: function (oResponse) {
		                    var oBatchResponse = oResponse.__batchResponses[0];
		                    var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
		                    if (oChangeResponse && oChangeResponse.data) {
		                        var sNewContext = oModel.getKey(oChangeResponse.data);
		                        oView.unbindObject();
		                        oView.bindObject({path: "/" + sNewContext});
		                        if (window.history && window.history.replaceState) {
		                            window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext), encodeURIComponent(sNewContext)));
		                        }
		                        oModel.refresh();
		                        fnResolve();
		                    }
		                    else if (oChangeResponse && oChangeResponse.response) {
		                        fnResetChangesAndReject(oChangeResponse.message);
		                    }
		                    else if (!oChangeResponse && oBatchResponse.response) {
		                        fnResetChangesAndReject(oBatchResponse.message);
		                    }
		                    else {
		                        oModel.refresh();
		                        fnResolve();
		                    }
		                },
		                error: function (oError) {
		                    fnReject(new Error(oError.message));
		                }
		            });
		        } else {
		            fnResolve();
		        }
		    });
		
		}.bind(this))
		.then(function (result) { if (result === false) { return false; } else {
		    
		var oBindingContext = oEvent.getSource().getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		
		    this.doNavigate("list", oBindingContext, fnResolve, ""
		    );
		}.bind(this));
		
		}}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
        },
doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
            		
		var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
		var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
		
		var sEntityNameSet;
		if (sPath !== null && sPath !== "") {
		    if (sPath.substring(0, 1) === "/") {
		        sPath = sPath.substring(1);
		    }
		    sEntityNameSet = sPath.split("(")[0];
		}
		var sNavigationPropertyName;
		var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
		
		if (sEntityNameSet !== null) {
		    sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
		}
		if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
		    if (sNavigationPropertyName === "") {
		        this.oRouter.navTo(sRouteName, {
		            context: sPath,
		            masterContext: sMasterContext
		        }, false);
		    } else {
		        oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
		            if (bindingContext) {
		                sPath = bindingContext.getPath();
		                if (sPath.substring(0, 1) === "/") {
		                    sPath = sPath.substring(1);
		                }
		            }
		            else {
		                sPath = "undefined";
		            }
		
		            // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
		            if (sPath === "undefined") {
		                this.oRouter.navTo(sRouteName);
		            } else {
		                this.oRouter.navTo(sRouteName, {
		                    context: sPath,
		                    masterContext: sMasterContext
		                }, false);
		            }
		        }.bind(this));
		    }
		} else {
		    this.oRouter.navTo(sRouteName);
		}
		
		if (typeof fnPromiseResolve === "function") {
		    fnPromiseResolve();
		}
        },
_onButtonPress1: function (oEvent) {
            		
		oEvent = jQuery.extend(true, {}, oEvent);
		return new Promise(function (fnResolve) { fnResolve(true); })
		.then(function (result) {
		    return new Promise(function(fnResolve) {
		    sap.m.MessageBox.confirm("Are you sure you want to cancel your changes?", {
		        title: "Cancel changes?",
		        actions: ["Yes", "No"],
		        onClose: function(sActionClicked) {
		            fnResolve(sActionClicked ===  "Yes");
		        }
		    });
		});
		
		}.bind(this))
		.then(function (result) { if (result === false) { return false; } else {
		    return new Promise(function (fnResolve) {
		    var aChangedEntitiesPath, oChangedBindingContext;
		        var oModel = this.oModel;
		        if (oModel && oModel.hasPendingChanges()) {
		            aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);
		
		            for (var j = 0; j < aChangedEntitiesPath.length; j++) {
		                oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
		                if (oChangedBindingContext && oChangedBindingContext.bCreated) {
		                    oModel.deleteCreatedEntry(oChangedBindingContext);
		                }
		            }
		            oModel.resetChanges();
		        }
		    fnResolve();
		}.bind(this));
		
		
		}}.bind(this))
		.then(function (result) { if (result === false) { return false; } else {
		    
		var oBindingContext = oEvent.getSource().getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		
		    this.doNavigate("list", oBindingContext, fnResolve, ""
		    );
		}.bind(this));
		
		}}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
        },
onInit: function () {
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("ItemCreation1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

        this.oModel = this.getOwnerComponent().getModel();


        }
});
}, /* bExport= */true);
