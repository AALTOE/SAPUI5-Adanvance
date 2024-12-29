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
            //Llamamos la entidad para elminar una incidencia
            this._bus.subscribe("incidence", "onDeleteIncidence", function (channelId, eventId, data) {
                
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId +
                    "',EmployeeId='" + data.EmployeeId + "')", {
                    success: function () {
                        this.onReadOdataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });
            }, this);
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
            this.onReadOdataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
            sap.ui.core.BusyIndicator.hide();
        },
        /**
         * función que guarda una incidencia al ODATA
         * @param {*} chanellId 
         * @param {*} eventId 
         * @param {*} data 
         */
        onSaveOdataIncidence: function (chanellId, eventId, data) {
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
                        this.onReadOdataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })
                //Lógica que valida si se trata de una actualización
            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {
                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX
                };

                this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                    success: function () {
                        this.onReadOdataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                });
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            };
        },
        /**
         * Función que obtiene las incidencias y se muestra en la vista
         * @param {*} employeeId 
         */
        onReadOdataIncidence: function (employeeId) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeId.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    //Borramos todo el contenido cuando el usuario presiona variaveces el mismo item
                    tableIncidence.removeAllContent();
                    //Colocamos cada registro en la tabla
                    for (var incidence in data.results) {
                        var newIncidence = sap.ui.xmlfragment("logaligroup.logali.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {
                    console.log(e);
                }
            });
        }
    });
});