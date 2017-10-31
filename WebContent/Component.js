sap.ui.define([
                "sap/ui/core/UIComponent",
                "sap/m/routing/RouteMatchedHandler"
], function(UIComponent, RouteMatchedHandler) {
                "use strict";


return UIComponent.extend("fmg.conmon.Component", {
  metadata: {
    name: "fmg.conmon",
    version: "1.0",
    dependencies: {
      libs: [
        "sap.m", "sap.ui.layout"
      ],
      components: []
    },
    includes: [
      "css/style.css"
    ],
    "config": {
      fullWidth: true,
      serviceConfig: {
      }
    },

    routing: {
      config: {
        //routerClass: fmg.conmon.lpd.MyRouter,
        viewType: "XML",
        viewPath: "fmg.conmon.view", // common prefix,
        targetAggregation: "pages",
        targetControl: "mainContent",
        clearTarget: true
      },
      routes: [
    	 
          {
              pattern: "EventList",
              name: "EventList",
              view: "EventList",
              viewId: "idEventList"
            } ,
        {
          pattern: "",
          name: "Launchpad",
          view: "Launchpad",
          viewId: "idLaunchpad"
        }, {
          pattern: ":all*:",
          name: "defaultPage",
          view: "Launchpad",
          viewId: "idLaunchpad"
        }
      ]
    }

  },

  init: function() {

    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
    // use absolute path
    this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
    this.getRouter().initialize();
  },

  createContent: function() {
    var oView = sap.ui.view({
      id: "app",
      viewName: "fmg.conmon.view.App",
      type: "XML",
      viewData: {
        component: this
      }
    });

    var rootPath = jQuery.sap.getModulePath("fmg.conmon");
    var i18nModel = new sap.ui.model.resource.ResourceModel({
      bundleUrl: rootPath + "/i18n/messageBundle.properties"
    });
    oView.setModel(i18nModel, "i18n");


    return oView;
  }
});
});

