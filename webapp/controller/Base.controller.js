sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("logaligroup.logali.controller.Base", {

            onInit: function () {

            },

            /**
            * Función que envia un id y abre una nueva vista para obtener los detalles
            * @param {*} oEvent 
            */
            toOrderDetails: function (oEvent) {
                var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
                var oReouter = sap.ui.core.UIComponent.getRouterFor(this);
                oReouter.navTo("RouteOrderDetails", {
                    OrderID: orderID
                });
            }
        });
    }
);