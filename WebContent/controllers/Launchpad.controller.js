sap.ui.define([
  "sap/ui/core/mvc/Controller", "fmg/conmon/util/Utils"
], function(Controller, Utils) {

	
  var LaunchPadController = sap.ui.core.mvc.Controller.extend("fmg.conmon.controllers.Launchpad", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to modify the View before it is
     * displayed, to bind event handlers and do other one-time initialization.
     * 
     * @memberOf Search Policy
     */
    onInit: function() {
      console.log("init main");
      var that = this;
     
      this._busyDialog = sap.ui.xmlfragment("fmg.conmon.fragments.BusyDialog", this);
      this.oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.attachRouteMatched(this.onRouteMatched, this);
    },


    onRouteMatched: function(oEvent) {
        console.log("onRoute Match from Main")
        var oParameters = oEvent.getParameters();
        console.log(oParameters);
//        if (oParameters.name === "Launchpad" || oParameters.name === "defaultPage") {
//            console.log("Launchpad Screen");          
//        }
    },


    setEmployeeData: function(data) {
      console.log(data);
      var model = new sap.ui.model.json.JSONModel();
      model.setData(data);
      sap.ui.getCore().setModel(model);
      
      this.getView().setModel(model, "employeeModel");
      Utils.loadSitelist(data.user, this);
      Utils.loadAuth(data.defaultSite, this);
    },

    onBeforeRendering: function() { 
      

    },

    onAfterRendering: function() {  
        
        this._busyDialog.close(); 
    },  


    showTiles: function(array) {
       
        //check auth
        this._authArray = array;
        var that = this;
        this._authArray.forEach(function(o) {
              console.log(that.byId(o.activity));
              if(that.byId(o.activity)) {
                that.byId(o.activity).setVisible(true);
              }
        });

    },

    pressTile: function(oEvent) {
    	this.oRouter.navTo("EventList");
    },
                                    
    handleLogoffPress:function(){
        console.log("log off");
        if(!this._logOutDialog){
            this._logOutDialog = sap.ui.xmlfragment("fmg.conmon.fragments.LogOutDialog", this);
            this.getView().addDependent(this._logOutDialog);
        }
        this._logOutDialog.open();
    },
                                    
    handleCancelDialog:function(){
        this._logOutDialog.close();
    },
                                    
    handleLogoutPressed:function(oEvent){
        //sap.ui.core.UIComponent.getRouterFor(this).navTo("Login", {}, false);
    },

    handleShowQRCodeScan:function(oEvent){  
    }
                            
  });
  return  // }());
});
