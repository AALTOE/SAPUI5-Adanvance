sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/logali/model/formatter"
], function (Controller, formatter) {

    function onInit() {

    };
    /**
     * Función que se encarga de realizar el binding del índice para el modelo incidenceModel.
     * Tambien al preisonar el boton se crea una nueva fila con los elementos selec, date, input y select
     */
    function onCreateIncidence(){
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.logali.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index : index + 1});
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence)
    };
    /**
     * Funcion que elimina alguna incidencia
     * @param {*} oEvent 
     */
    function onDeleteInsidence (oEvent){
        //Identificamos donde esta la tabla de incidencias
        var tableIncidence = this.getView().byId("tableIncidence"); 
        //Obtenemos la fila o el elemento seleccionado
        var rowIncidence = oEvent.getSource().getParent().getParent();
        //Obtenemos los datos lde moelo incidenceModel
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObject = rowIncidence.getBindingContext("incidenceModel");
        //Eliminamos los datos y reinciamos el indice
        odata.splice(contextObject.index-1,1);
        for (var i in odata) {
            odata[i].index = parseInt(i) + 1;
        };
        //Refrescamos el modelo
        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncidence);

        for (var j in tableIncidence.getContent()) {
            tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
        }
    };

    var Main = Controller.extend("logaligroup.logali.controller.EmployeeDetails", {});
    Main.prototype.onInit = onInit;
    Main.prototype.onCreateIncidence = onCreateIncidence;
    Main.prototype.Formatter = formatter;
    Main.prototype.onDeleteInsidence = onDeleteInsidence;
    return Main;
});