sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History"
    ],
    function (BaseController, History) {
      "use strict";
      
      function _onObjectMatched(oEvent){
        this.getView().bindElement({
          path : "/Orders("+ oEvent.getParameter("arguments").OrderID +")",
          model : "odataNorthwind"
        })
      }

      return BaseController.extend("logaligroup.logali.controller.OrderDetails", {
  
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        },
        /**
         * Función que regresa a una pagina anterior y accede al detalle directamente pasando el ID
         * @param {*} oEvent 
         */
        onBack : function (oEvent) {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if(sPreviousHash !== undefined){
              //Regresamos a la vista anterior
              window.history.go(-1);
            }else{
              //Aqui llega directamente a la vista de los detalles
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("RouteMain", true);
            }
        }
      });
    }
  );