sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    return Controller.extend("logaligroup.logali.controller.Main", {

        /**
         * Función que se llama antes de renderizar la app
         * debido al ciclo de vida de la app
         */
        onBeforeRendering: function () {
            //Variable global
            this._detailEmployeeView = this.getView().byId("detailEmployeeView");
        },

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
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveOdataIncidence, this);
        },
        /**
         * Función que sirve para cambiar el layout al selecionar algun empleado
         * @param {*} category 
         * @param {*} nameEvent 
         * @param {*} path 
         */
        showEmployeeDetails: function (category, nameEvent, path) {
            sap.ui.core.BusyIndicator.show(0);
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidencemodel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidencemodel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();
            sap.ui.core.BusyIndicator.hide();
        },
        /**
         * función que guarda una incidencia al ODATA
         * @param {*} chanellId 
         * @param {*} eventId 
         * @param {*} data 
         */
        onSaveOdataIncidence: function (chanellId, eventId, data,) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {

                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                }

                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            };
        }
    });
});