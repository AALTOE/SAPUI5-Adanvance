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
        },

        onClearSignature : function (oEvent) {
          var signature = this.byId("signature");
          signature.clear();
        },

        factoryOrderDetails : function (listId, oContext) {
          var contextObject = oContext.getObject();
          contextObject.Currency = "EUR";
          var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

          if(contextObject.Quantity <= unitsInStock){
            var objectListItem = new sap.m.ObjectListItem ({
                title : "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                number : "{parts : [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type :'sap.ui.model.type.Currency', formatOptions:{showMeasure: false}}",
                numberUnit : "{odataNorthwind>Currency}"
            });
            return objectListItem;
          }else {
            var customListItem = new sap.m.CustomListItem({
              content: [
                new sap.m.Bar({
                  contentLeft : new sap.m.Label({text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"}),
                  contentMiddle : new sap.m.ObjectStatus({ text: "{i18n>aviableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state:"Error"}),
                  contentRight : new sap.m.Label({text : "{parts : [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type :'sap.ui.model.type.Currency'}"})
                })
              ]
            });
            return customListItem;
          }
        }
      });
    }
  );