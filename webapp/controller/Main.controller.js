sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    return Controller.extend("logaligroup.logali.controller.Main", {

        onInit: function () {
            //Variable para obtener la instancia de la vista
            var oView = this.getView();
            //Variable para crear la instancia o nuevo modelo con JSONModel
            var oJSONModelEmployees = new sap.ui.model.json.JSONModel();
            //Se cargan los datos desde un fichero de empleado
            oJSONModelEmployees.loadData("./localService/mockdata/Employees.json", false);
            //Se vincula los datos a la vista
            oView.setModel(oJSONModelEmployees, "jsonEmployees");
            //Variable para crear la instancia o modelo apartir de Layouts.json
            var oJSONModelLayouts = new sap.ui.model.json.JSONModel();
            oJSONModelLayouts.loadData("./localService/mockdata/Layouts.json", false);
            oView.setModel(oJSONModelLayouts, "jsonLayouts");
            //Creación del tercer modelo
            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");
            //Creación del tercer modelo para mostrar y ocultar datos
            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonCounfig");

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

        },
        /**
         * Función que sirve para cambiar el layout al selecionar algun empleado
         * @param {*} category 
         * @param {*} nameEvent 
         * @param {*} path 
         */
        showEmployeeDetails : function (category, nameEvent ,path ){
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("jsonEmployees>" + path);
            this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
        }

    });
});