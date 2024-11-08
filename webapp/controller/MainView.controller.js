sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @returns 
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.logali.controller.MainView", {
            onInit: function () {

            },

        /**
         * Función que valida la longitud dentro del input,
         * mostrando una lista cuando la longitud es igual a 6 ó
         * ocultando una lista cuando la longitud es menor a 6
         */
        onValidate: function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("NOT OK");
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            }
        }

        });
    });
