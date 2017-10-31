sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./EventList/utilities",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("fmg.conmon.controller.dialog_1", {
    setRouter: function (oRouter) {
            		                this.oRouter = oRouter;
		
        },
getBindingParameters: function () {
            		return {};
		
        },
_onButtonPress8: function () {
            		var oDialog = this.getView().getContent()[0];
		
		return new Promise(function (fnResolve) {
		    oDialog.attachEventOnce("afterClose", null, fnResolve);
		    oDialog.close();
		});
		
        },
onInit: function () {
            		        this.mBindingOptions = {};
        this._oDialog = this.getView().getContent()[0];

        },
onExit: function () {
            		                this._oDialog.destroy();

        }
});
}, /* bExport= */true);
